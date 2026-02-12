import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchBill, compareCuvXml, consultarCUV } from './searchBill';

vi.mock('../lib/api', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '../lib/api';

function mockJsonResponse({ ok = true, status = 200, body = {} }) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
}

describe('searchBill service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when searching with empty invoice number', async () => {
    await expect(SearchBill('   ')).rejects.toThrow();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('calls invoice endpoint with encoded params', async () => {
    apiFetch.mockResolvedValue(mockJsonResponse({ body: { ok: true } }));

    await SearchBill('FAC 100', 55);

    expect(apiFetch).toHaveBeenCalledWith(
      '/api/auth/search/factura?num_factura=FAC%20100&user_id=55',
    );
  });

  it('omits user_id when user object is provided', async () => {
    apiFetch.mockResolvedValue(mockJsonResponse({ body: { ok: true } }));

    await SearchBill('FAC100', { id: 10 });

    expect(apiFetch).toHaveBeenCalledWith(
      '/api/auth/search/factura?num_factura=FAC100',
    );
  });

  it('consultarCUV sends trimmed payload', async () => {
    apiFetch.mockResolvedValue(mockJsonResponse({ body: { EsValido: true } }));

    await consultarCUV('  abc123  ');

    expect(apiFetch).toHaveBeenCalledWith(
      '/api/auth/consultar-cuv',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ codigoUnicoValidacion: 'abc123' }),
      }),
    );
  });

  it('consultarCUV throws on explicit failed response without validation details', async () => {
    apiFetch.mockResolvedValue(
      mockJsonResponse({
        ok: false,
        status: 400,
        body: { message: 'bad request' },
      }),
    );

    await expect(consultarCUV('abc')).rejects.toThrow('bad request');
  });

  it('compareCuvXml validates required inputs', async () => {
    await expect(compareCuvXml(null, null, '')).rejects.toThrow();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('compareCuvXml posts form-data and returns parsed result', async () => {
    const result = { comparison: { isMatch: true } };
    apiFetch.mockResolvedValue(mockJsonResponse({ body: result }));

    const xmlFile = new File(['<xml/>'], 'invoice.xml', { type: 'application/xml' });
    const output = await compareCuvXml(null, xmlFile, 'cuv-123');

    expect(apiFetch).toHaveBeenCalledWith(
      '/api/auth/compare-cuv-xml',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );
    expect(output).toEqual(result);
  });
});
