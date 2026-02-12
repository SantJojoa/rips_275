import { XMLParser } from 'fast-xml-parser'
import logger from './logger.js'
import { createError } from './errorHandler.js'

export class XmlParser {

    static createParser() {
        return new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            textNodeName: '_text',
            trimValues: true,
            removeNSPrefix: true
        })
    }

    static extractPayableAmount(xmlContent) {
        try {
            const parser = this.createParser()
            const parsed = parser.parse(xmlContent)

            const invoiceXml = this.findInvoiceXml(parsed)

            if (!invoiceXml) {
                throw createError(400, 'No se encontró el XML de la factura (Invoice) en el archivo')
            }

            const invoiceDoc = parser.parse(invoiceXml)

            const payableAmount =
                invoiceDoc?.Invoice
                    ?.LegalMonetaryTotal
                    ?.PayableAmount
                    ?._text

            if (!payableAmount) {
                throw createError(400, 'No se encontró el campo PayableAmount en el XML Invoice')
            }

            const value = parseFloat(payableAmount)
            if (isNaN(value)) {
                throw createError(400, 'PayableAmount no es numérico')
            }

            logger.info('PayableAmount extraído', { value })
            return value

        } catch (error) {
            if (error.status) throw error
            throw createError(400, `Error al procesar el archivo XML: ${error.message}`)
        }
    }

    static findInvoiceXml(node, depth = 0) {
        if (depth > 20) return null

        if (typeof node === 'string') {
            if (node.includes('<Invoice')) {
                return node
            }
            return null
        }

        if (typeof node !== 'object' || node === null) {
            return null
        }

        for (const key of Object.keys(node)) {
            const found = this.findInvoiceXml(node[key], depth + 1)
            if (found) return found
        }

        return null
    }
}
