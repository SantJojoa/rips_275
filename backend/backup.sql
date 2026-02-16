--
-- PostgreSQL database dump
--

\restrict 9LwPAX8bcSaKh6IBnJb7FuCeRwa5UpMAxDYJaEXXsGFkEpCUjWWeBkJphukaN7B

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_control_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_control_status AS ENUM (
    'ACT',
    'INACT',
    'ERROR'
);


ALTER TYPE public.enum_control_status OWNER TO postgres;

--
-- Name: enum_system_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_system_users_role AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public.enum_system_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: consultas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultas (
    id integer NOT NULL,
    id_user integer,
    tipo_doc_user character varying(255),
    num_doc_user character varying(255),
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.consultas OWNER TO postgres;

--
-- Name: consultas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultas_id_seq OWNER TO postgres;

--
-- Name: consultas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultas_id_seq OWNED BY public.consultas.id;


--
-- Name: control; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control (
    id integer NOT NULL,
    id_system_user integer,
    id_prestador integer,
    periodo_fac integer,
    "año" integer,
    route text,
    status public.enum_control_status,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    numero_radicado character varying(255)
);


ALTER TABLE public.control OWNER TO postgres;

--
-- Name: control_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.control_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.control_id_seq OWNER TO postgres;

--
-- Name: control_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.control_id_seq OWNED BY public.control.id;


--
-- Name: hospitalizaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitalizaciones (
    id integer NOT NULL,
    id_user integer,
    tipo_doc_user character varying(255),
    num_doc_user character varying(255),
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.hospitalizaciones OWNER TO postgres;

--
-- Name: hospitalizaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospitalizaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospitalizaciones_id_seq OWNER TO postgres;

--
-- Name: hospitalizaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospitalizaciones_id_seq OWNED BY public.hospitalizaciones.id;


--
-- Name: medicamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicamentos (
    id integer NOT NULL,
    id_user integer,
    tipo_doc_user character varying(255),
    num_doc_user character varying(255),
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.medicamentos OWNER TO postgres;

--
-- Name: medicamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medicamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicamentos_id_seq OWNER TO postgres;

--
-- Name: medicamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medicamentos_id_seq OWNED BY public.medicamentos.id;


--
-- Name: otro_servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otro_servicios (
    id integer NOT NULL,
    id_user integer,
    tipo_doc_user character varying(255),
    num_doc_user character varying(255),
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.otro_servicios OWNER TO postgres;

--
-- Name: otro_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otro_servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otro_servicios_id_seq OWNER TO postgres;

--
-- Name: otro_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otro_servicios_id_seq OWNED BY public.otro_servicios.id;


--
-- Name: prestadores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestadores (
    id integer NOT NULL,
    nombre_departamento character varying(255),
    cod_habilitacion character varying(255),
    nombre_prestador character varying(255),
    nit character varying(255),
    razon_social character varying(255),
    ese character varying(255),
    direccion character varying(255),
    telefono character varying(255),
    fax character varying(255),
    email character varying(255),
    nivel integer,
    carcter character varying(255),
    habilitado character varying(255),
    naju_nombre character varying(255),
    rep_legal character varying(255),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    muni_nombre character varying(255),
    naju_codigo character varying(255)
);


ALTER TABLE public.prestadores OWNER TO postgres;

--
-- Name: prestador_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prestador_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prestador_id_seq OWNER TO postgres;

--
-- Name: prestador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prestador_id_seq OWNED BY public.prestadores.id;


--
-- Name: procedimientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedimientos (
    id integer NOT NULL,
    id_user integer,
    tipo_doc_user character varying(255),
    num_doc_user character varying(255),
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.procedimientos OWNER TO postgres;

--
-- Name: procedimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procedimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procedimientos_id_seq OWNER TO postgres;

--
-- Name: procedimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procedimientos_id_seq OWNED BY public.procedimientos.id;


--
-- Name: recien_nacidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recien_nacidos (
    id integer NOT NULL,
    id_user integer,
    tipo_doc_user character varying(255),
    num_doc_user character varying(255),
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.recien_nacidos OWNER TO postgres;

--
-- Name: recien_nacidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recien_nacidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recien_nacidos_id_seq OWNER TO postgres;

--
-- Name: recien_nacidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recien_nacidos_id_seq OWNED BY public.recien_nacidos.id;


--
-- Name: system_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_system_users_role DEFAULT 'USER'::public.enum_system_users_role NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp without time zone,
    nombres character varying(255),
    apellidos character varying(255),
    cedula character varying(255)
);


ALTER TABLE public.system_users OWNER TO postgres;

--
-- Name: system_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_users_id_seq OWNER TO postgres;

--
-- Name: system_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_users_id_seq OWNED BY public.system_users.id;


--
-- Name: transaccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaccion (
    id integer NOT NULL,
    id_control integer,
    num_nit integer,
    num_factura character varying(255),
    valor_factura double precision,
    tipo_nota character varying(255),
    num_nota character varying(255),
    fecha timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.transaccion OWNER TO postgres;

--
-- Name: transaccion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaccion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaccion_id_seq OWNER TO postgres;

--
-- Name: transaccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaccion_id_seq OWNED BY public.transaccion.id;


--
-- Name: urgencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.urgencias (
    id integer NOT NULL,
    id_user integer,
    tipo_doc_user character varying(255),
    num_doc_user character varying(255),
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.urgencias OWNER TO postgres;

--
-- Name: urgencias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.urgencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.urgencias_id_seq OWNER TO postgres;

--
-- Name: urgencias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.urgencias_id_seq OWNED BY public.urgencias.id;


--
-- Name: user_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_transactions (
    id integer NOT NULL,
    id_user integer NOT NULL,
    id_transaction integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_transactions OWNER TO postgres;

--
-- Name: user_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_transactions_id_seq OWNER TO postgres;

--
-- Name: user_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_transactions_id_seq OWNED BY public.user_transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    tipo_doc character varying(255),
    num_doc character varying(255),
    tipo_usuario character varying(255),
    fecha_nacimiento timestamp with time zone,
    cod_sexo character varying(255),
    cod_pais_residencia character varying(255),
    cod_municipio_residencia character varying(255),
    incapacidad character varying(255),
    consecutivo character varying(255),
    cod_pais_origen character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: consultas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas ALTER COLUMN id SET DEFAULT nextval('public.consultas_id_seq'::regclass);


--
-- Name: control id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control ALTER COLUMN id SET DEFAULT nextval('public.control_id_seq'::regclass);


--
-- Name: hospitalizaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitalizaciones ALTER COLUMN id SET DEFAULT nextval('public.hospitalizaciones_id_seq'::regclass);


--
-- Name: medicamentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamentos ALTER COLUMN id SET DEFAULT nextval('public.medicamentos_id_seq'::regclass);


--
-- Name: otro_servicios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otro_servicios ALTER COLUMN id SET DEFAULT nextval('public.otro_servicios_id_seq'::regclass);


--
-- Name: prestadores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestadores ALTER COLUMN id SET DEFAULT nextval('public.prestador_id_seq'::regclass);


--
-- Name: procedimientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedimientos ALTER COLUMN id SET DEFAULT nextval('public.procedimientos_id_seq'::regclass);


--
-- Name: recien_nacidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recien_nacidos ALTER COLUMN id SET DEFAULT nextval('public.recien_nacidos_id_seq'::regclass);


--
-- Name: system_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users ALTER COLUMN id SET DEFAULT nextval('public.system_users_id_seq'::regclass);


--
-- Name: transaccion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaccion ALTER COLUMN id SET DEFAULT nextval('public.transaccion_id_seq'::regclass);


--
-- Name: urgencias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urgencias ALTER COLUMN id SET DEFAULT nextval('public.urgencias_id_seq'::regclass);


--
-- Name: user_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_transactions ALTER COLUMN id SET DEFAULT nextval('public.user_transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250923221330-create-system-user.js
20250923221332-create-prestador.js
20250923221333-create-control.js
20250923221333-create-user.js
20250923221334-create-transaccion.js
20250924011652-create-procedimiento.js
20250924011711-create-hospitalizacion.js
20250924011736-create-recien-nacido.js
20250924011802-create-urgencia.js
20250924011824-create-consulta.js
20250924011837-create-medicamento.js
20250924011909-create-otro-servicio.js
20250924042515-rename-tables-to-snake_case.js
20250924044812-rename-prestador-to-prestadores.js
20250924153614-add-municipio-name.js
20250924160351-add-naju-co.js
20250924163046-change-fax-to-bigint.js
20250924163559-change-fax-to-text.js
20250924194917-update-system-users.js
20250924050000-alter-users-num_doc-to-string.js
20250930213229-modify-control-table.js
20250127000000-add-fields-to-system-users.js
20251006163038-alter-transaction-table.js
20251007000000-create-user-transaction-join.js
\.


--
-- Data for Name: consultas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultas (id, id_user, tipo_doc_user, num_doc_user, data, "createdAt", "updatedAt") FROM stdin;
1	1	CC	123456	{"vrServicio": 30000, "codConsulta": "010204", "codServicio": 108, "consecutivo": 1, "codPrestador": "52000", "grupoServicios": "02", "numAutorizacion": "", "tipoPagoModerador": "02", "valorPagoModerador": 30000, "causaMotivoAtencion": "25", "fechaInicioAtencion": "2024-05-31", "numFEVPagoModerador": "", "codDiagnosticoPrincipal": "A000", "finalidadTecnologiaSalud": "15", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": "", "codDiagnosticoRelacionado2": "", "codDiagnosticoRelacionado3": "", "numDocumentoIdentificacion": "123456", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "03"}	2025-10-14 16:53:03.952-05	2025-10-14 16:53:03.952-05
2	2	CC	1377000110	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 1, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-05-01 11:04", "numFEVPagoModerador": "null", "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1089291160", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "04"}	2025-10-15 11:36:58.962-05	2025-10-15 11:36:58.962-05
3	3	CC	1379000107	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 1, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-05-22 11:01", "numFEVPagoModerador": "null", "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1089292782", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "03"}	2025-10-15 11:36:58.971-05	2025-10-15 11:36:58.971-05
4	3	CC	1379000107	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 2, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-05-16 11:02", "numFEVPagoModerador": "null", "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1089292782", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "03"}	2025-10-15 11:36:58.973-05	2025-10-15 11:36:58.973-05
5	3	CC	1379000107	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 3, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-05-01 11:03", "numFEVPagoModerador": "null", "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1089291160", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "03"}	2025-10-15 11:36:58.975-05	2025-10-15 11:36:58.975-05
7	4	DE	VEN28249144	{"vrServicio": 93500, "codConsulta": "890701", "codServicio": 1102, "consecutivo": 1, "codPrestador": "520010110201", "grupoServicios": "05", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-07 17:32", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "01", "codDiagnosticoRelacionado1": "A511", "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "27081362", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.838-05	2025-10-23 11:07:07.838-05
8	4	DE	VEN28249144	{"vrServicio": 90700, "codConsulta": "890435", "codServicio": 1102, "consecutivo": 2, "codPrestador": "520010110201", "grupoServicios": "05", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-07 20:41", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "01", "codDiagnosticoRelacionado1": "A511", "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1085255798", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.839-05	2025-10-23 11:07:07.839-05
9	4	DE	VEN28249144	{"vrServicio": 70200, "codConsulta": "890702", "codServicio": 1102, "consecutivo": 3, "codPrestador": "520010110201", "grupoServicios": "05", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-07 23:32", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "01", "codDiagnosticoRelacionado1": "A511", "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1053789319", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.841-05	2025-10-23 11:07:07.841-05
10	4	DE	VEN28249144	{"vrServicio": 184100, "codConsulta": "890454", "codServicio": 129, "consecutivo": 4, "codPrestador": "520010110201", "grupoServicios": "03", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-10 13:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "01", "codDiagnosticoRelacionado1": "A511", "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "87067607", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.843-05	2025-10-23 11:07:07.843-05
11	4	DE	VEN28249144	{"vrServicio": 477000, "codConsulta": "890602", "codServicio": 1102, "consecutivo": 5, "codPrestador": "520010110201", "grupoServicios": "05", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-08 11:34", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "01", "codDiagnosticoRelacionado1": "A511", "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1053789319", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.844-05	2025-10-23 11:07:07.844-05
12	4	DE	VEN28249144	{"vrServicio": 90700, "codConsulta": "890494", "codServicio": 1102, "consecutivo": 6, "codPrestador": "520010110201", "grupoServicios": "05", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-08 11:35", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "01", "codDiagnosticoRelacionado1": "A511", "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "87067607", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.847-05	2025-10-23 11:07:07.847-05
13	2	CC	1377000110	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 1, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-09-01 08:43", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1089291160", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "04"}	2025-10-31 11:27:40.755-05	2025-10-31 11:27:40.755-05
14	2	CC	1377000110	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 2, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-09-23 09:51", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1004600892", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "04"}	2025-10-31 11:27:40.784-05	2025-10-31 11:27:40.784-05
15	3	CC	1379000107	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 1, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-09-12 08:40", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1089292782", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "04"}	2025-10-31 11:27:40.789-05	2025-10-31 11:27:40.789-05
16	3	CC	1379000107	{"vrServicio": 0, "codConsulta": "I10603", "codServicio": 328, "consecutivo": 2, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-09-01 08:41", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "Z718", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1089291160", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "04"}	2025-10-31 11:27:40.79-05	2025-10-31 11:27:40.79-05
21	6	CC	1379000112	{"vrServicio": 0, "codConsulta": "I10301", "codServicio": 328, "consecutivo": 1, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-09-30 07:50", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "Z208", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1006850779", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "04"}	2025-11-11 17:49:10.822-05	2025-11-11 17:49:10.822-05
22	6	CC	1379000112	{"vrServicio": 0, "codConsulta": "I10301", "codServicio": 328, "consecutivo": 2, "codPrestador": "520790005501", "grupoServicios": "01", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-09-30 07:51", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "Z208", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "02", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "1006850779", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "04"}	2025-11-11 17:49:10.835-05	2025-11-11 17:49:10.835-05
23	7	DE	VEN26792185	{"vrServicio": 93500, "codConsulta": "890701", "codServicio": 1102, "consecutivo": 1, "codPrestador": "520010110201", "grupoServicios": "05", "conceptoRecaudo": "05", "numAutorizacion": null, "valorPagoModerador": 0, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-08-10 08:32", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "finalidadTecnologiaSalud": "44", "tipoDiagnosticoPrincipal": "01", "codDiagnosticoRelacionado1": null, "codDiagnosticoRelacionado2": null, "codDiagnosticoRelacionado3": null, "numDocumentoIdentificacion": "98387547", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2026-02-12 09:37:55.72-05	2026-02-12 09:37:55.72-05
\.


--
-- Data for Name: control; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.control (id, id_system_user, id_prestador, periodo_fac, "año", route, status, "createdAt", "updatedAt", numero_radicado) FROM stdin;
9	6	1	2	2021	uploads\\5d3e1673fe51c9c07b0810af974f19e3	ACT	2026-02-12 09:37:55.796-05	2026-02-12 09:37:55.81-05	2026-9
\.


--
-- Data for Name: hospitalizaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospitalizaciones (id, id_user, tipo_doc_user, num_doc_user, data, "createdAt", "updatedAt") FROM stdin;
1	4	DE	VEN28249144	{"consecutivo": 1, "fechaEgreso": "2025-03-12 14:21", "codPrestador": "520010110201", "codComplicacion": null, "numAutorizacion": null, "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-07 17:28", "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "codDiagnosticoPrincipalE": "L039", "codDiagnosticoCausaMuerte": null, "codDiagnosticoRelacionadoE1": "A511", "codDiagnosticoRelacionadoE2": null, "codDiagnosticoRelacionadoE3": null, "condicionDestinoUsuarioEgreso": "01"}	2025-10-23 11:07:07.868-05	2025-10-23 11:07:07.868-05
\.


--
-- Data for Name: medicamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicamentos (id, id_user, tipo_doc_user, num_doc_user, data, "createdAt", "updatedAt") FROM stdin;
1	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 14256, "consecutivo": 1, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 18:30", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 7128, "codTecnologiaSalud": "1S1016191004104", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.876-05	2025-10-23 11:07:07.876-05
2	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 2560, "consecutivo": 2, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 18:30", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2560, "codTecnologiaSalud": "1D1036531001100", "nomTecnologiaSalud": "DICLOFENACO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.879-05	2025-10-23 11:07:07.879-05
3	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 1196, "consecutivo": 3, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 18:30", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 1196, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "TRAMADOL", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.88-05	2025-10-23 11:07:07.88-05
4	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 8220, "consecutivo": 4, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 18:30", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.881-05	2025-10-23 11:07:07.881-05
5	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 4024, "consecutivo": 5, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF003", "unidadMinDispensa": 13, "vrUnitMedicamento": 4024, "codTecnologiaSalud": "1B1032871000101", "nomTecnologiaSalud": "BENZATINA BENCILPENICILINA", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.881-05	2025-10-23 11:07:07.881-05
6	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 2392, "consecutivo": 6, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 1196, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "TRAMADOL", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.882-05	2025-10-23 11:07:07.882-05
7	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 6381, "consecutivo": 7, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2127, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "METAMIZOL", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.882-05	2025-10-23 11:07:07.882-05
8	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 21384, "consecutivo": 8, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 7128, "codTecnologiaSalud": "1S1016191004104", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.884-05	2025-10-23 11:07:07.884-05
9	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 192612, "consecutivo": 9, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF003", "unidadMinDispensa": 75, "vrUnitMedicamento": 48153, "codTecnologiaSalud": "1V1002011000100", "nomTecnologiaSalud": "VANCOMICINA", "valorPagoModerador": 0, "cantidadMedicamento": 4, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.885-05	2025-10-23 11:07:07.885-05
10	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 2722, "consecutivo": 10, "codPrestador": "520010110201", "unidadMedida": 72, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF003", "unidadMinDispensa": 75, "vrUnitMedicamento": 2722, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "BENCILPENICILINA", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.886-05	2025-10-23 11:07:07.886-05
11	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 20550, "consecutivo": 11, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 5, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.889-05	2025-10-23 11:07:07.889-05
12	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 8700, "consecutivo": 12, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-07 22:33", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4350, "codTecnologiaSalud": "1S1016191001103", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.891-05	2025-10-23 11:07:07.891-05
13	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 13977, "consecutivo": 13, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-08 12:14", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 65, "vrUnitMedicamento": 13977, "codTecnologiaSalud": "1E1032981003103", "nomTecnologiaSalud": "ENOXAPARINA DE SODIO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.893-05	2025-10-23 11:07:07.893-05
14	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 6381, "consecutivo": 14, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-08 12:14", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2127, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "METAMIZOL", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.894-05	2025-10-23 11:07:07.894-05
15	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 192612, "consecutivo": 15, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-08 12:14", "formaFarmaceutica": "COLFF003", "unidadMinDispensa": 75, "vrUnitMedicamento": 48153, "codTecnologiaSalud": "1V1002011000100", "nomTecnologiaSalud": "VANCOMICINA", "valorPagoModerador": 0, "cantidadMedicamento": 4, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.895-05	2025-10-23 11:07:07.895-05
16	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 2392, "consecutivo": 16, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-08 12:14", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 1196, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "TRAMADOL", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.896-05	2025-10-23 11:07:07.896-05
17	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 20550, "consecutivo": 17, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-08 12:14", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 5, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.897-05	2025-10-23 11:07:07.897-05
18	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 8700, "consecutivo": 18, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-08 12:14", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4350, "codTecnologiaSalud": "1S1016191001103", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.897-05	2025-10-23 11:07:07.897-05
19	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 8700, "consecutivo": 19, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-09 08:15", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4350, "codTecnologiaSalud": "1S1016191001103", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.898-05	2025-10-23 11:07:07.898-05
20	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 20550, "consecutivo": 20, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-09 08:15", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 5, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.899-05	2025-10-23 11:07:07.899-05
21	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 13977, "consecutivo": 21, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-09 08:15", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 65, "vrUnitMedicamento": 13977, "codTecnologiaSalud": "1E1032981003103", "nomTecnologiaSalud": "ENOXAPARINA DE SODIO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.9-05	2025-10-23 11:07:07.9-05
22	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 2392, "consecutivo": 22, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-09 08:15", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 1196, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "TRAMADOL", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.901-05	2025-10-23 11:07:07.901-05
23	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 6381, "consecutivo": 23, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-09 08:15", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2127, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "METAMIZOL", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.902-05	2025-10-23 11:07:07.902-05
24	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 14256, "consecutivo": 24, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-09 08:15", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 7128, "codTecnologiaSalud": "1S1016191004104", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.904-05	2025-10-23 11:07:07.904-05
25	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 192612, "consecutivo": 25, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-09 08:15", "formaFarmaceutica": "COLFF003", "unidadMinDispensa": 75, "vrUnitMedicamento": 48153, "codTecnologiaSalud": "1V1002011000100", "nomTecnologiaSalud": "VANCOMICINA", "valorPagoModerador": 0, "cantidadMedicamento": 4, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.905-05	2025-10-23 11:07:07.905-05
26	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 14256, "consecutivo": 26, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 10:21", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 7128, "codTecnologiaSalud": "1S1016191004104", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.906-05	2025-10-23 11:07:07.906-05
27	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 3588, "consecutivo": 27, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 10:21", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 1196, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "TRAMADOL", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.907-05	2025-10-23 11:07:07.907-05
28	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 8508, "consecutivo": 28, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 10:21", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2127, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "METAMIZOL", "valorPagoModerador": 0, "cantidadMedicamento": 4, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.909-05	2025-10-23 11:07:07.909-05
29	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 13977, "consecutivo": 29, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 10:21", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 65, "vrUnitMedicamento": 13977, "codTecnologiaSalud": "1E1032981003103", "nomTecnologiaSalud": "ENOXAPARINA DE SODIO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.911-05	2025-10-23 11:07:07.911-05
30	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 5120, "consecutivo": 30, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 10:21", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2560, "codTecnologiaSalud": "1D1036531001100", "nomTecnologiaSalud": "DICLOFENACO", "valorPagoModerador": 0, "cantidadMedicamento": 2, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.912-05	2025-10-23 11:07:07.912-05
31	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 32880, "consecutivo": 31, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 10:21", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 8, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.913-05	2025-10-23 11:07:07.913-05
32	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 32880, "consecutivo": 32, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 18:46", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 8, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.914-05	2025-10-23 11:07:07.914-05
33	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 288909, "consecutivo": 33, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 18:46", "formaFarmaceutica": "COLFF003", "unidadMinDispensa": 13, "vrUnitMedicamento": 96303, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "PIPERACILINA", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.916-05	2025-10-23 11:07:07.916-05
34	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 22636, "consecutivo": 34, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 18:46", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 5659, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "CLINDAMICINA", "valorPagoModerador": 0, "cantidadMedicamento": 4, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.917-05	2025-10-23 11:07:07.917-05
35	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 114182, "consecutivo": 35, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-10 21:44", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 13, "vrUnitMedicamento": 114182, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "ACIDO GADOTERICO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085248539", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.918-05	2025-10-23 11:07:07.918-05
36	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 7680, "consecutivo": 36, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-11 13:23", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2560, "codTecnologiaSalud": "1D1036531001100", "nomTecnologiaSalud": "DICLOFENACO", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.92-05	2025-10-23 11:07:07.92-05
37	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 385212, "consecutivo": 37, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-11 13:23", "formaFarmaceutica": "COLFF003", "unidadMinDispensa": 13, "vrUnitMedicamento": 96303, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "PIPERACILINA", "valorPagoModerador": 0, "cantidadMedicamento": 4, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.92-05	2025-10-23 11:07:07.92-05
38	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 13977, "consecutivo": 38, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-11 13:23", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 65, "vrUnitMedicamento": 13977, "codTecnologiaSalud": "1E1032981003103", "nomTecnologiaSalud": "ENOXAPARINA DE SODIO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.922-05	2025-10-23 11:07:07.922-05
39	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 57540, "consecutivo": 39, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-11 13:23", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 14, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.923-05	2025-10-23 11:07:07.923-05
40	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 6381, "consecutivo": 40, "codPrestador": "520010110201", "unidadMedida": 62, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-11 13:23", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2127, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "METAMIZOL", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.924-05	2025-10-23 11:07:07.924-05
41	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 3588, "consecutivo": 41, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-11 13:23", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 1196, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "TRAMADOL", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.925-05	2025-10-23 11:07:07.925-05
42	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 16977, "consecutivo": 42, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-03-11 13:23", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 5659, "codTecnologiaSalud": "000", "nomTecnologiaSalud": "CLINDAMICINA", "valorPagoModerador": 0, "cantidadMedicamento": 3, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.926-05	2025-10-23 11:07:07.926-05
43	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 2560, "consecutivo": 1, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-08-10 09:09", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2560, "codTecnologiaSalud": "1D1036531001100", "nomTecnologiaSalud": "DICLOFENACO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.762-05	2026-02-12 09:37:55.762-05
44	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 4110, "consecutivo": 2, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-08-10 09:09", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 3, "vrUnitMedicamento": 4110, "codTecnologiaSalud": "1S1016191001100", "nomTecnologiaSalud": "SODIO CLORURO", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.775-05	2026-02-12 09:37:55.775-05
45	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 1938, "consecutivo": 3, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-08-10 09:09", "formaFarmaceutica": "C42916", "unidadMinDispensa": 14, "vrUnitMedicamento": 1938, "codTecnologiaSalud": "1T1002891000104", "nomTecnologiaSalud": "TAMSULOSINA", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.776-05	2026-02-12 09:37:55.776-05
46	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 2977, "consecutivo": 4, "codPrestador": "520010110201", "unidadMedida": 168, "conceptoRecaudo": "05", "diasTratamiento": 1, "numAutorizacion": null, "tipoMedicamento": "01", "fechaDispensAdmon": "2025-08-10 09:09", "formaFarmaceutica": "COLFF004", "unidadMinDispensa": 1, "vrUnitMedicamento": 2977, "codTecnologiaSalud": "1D1004301004101", "nomTecnologiaSalud": "DEXAMETASONA", "valorPagoModerador": 0, "cantidadMedicamento": 1, "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "concentracionMedicamento": 0, "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.777-05	2026-02-12 09:37:55.777-05
\.


--
-- Data for Name: otro_servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otro_servicios (id, id_user, tipo_doc_user, num_doc_user, data, "createdAt", "updatedAt") FROM stdin;
1	1	CC	123456	{"tipoOS": "03", "vrUnitOS": "52000", "icIMIPRES": "", "cantidadOS": "15", "vrServicio": "2222", "consecutivo": 1, "codPrestador": "520000", "numAutorizacion": "", "tipoPagoModerador": "", "codTecnologiaSalud": "010102", "nomTecnologiaSalud": "na", "valorPagoModerador": "", "numFEVPagoModerador": "", "fechaSuministroTecnologia": "2024-05-08", "numDocumentoIdentificacion": "123456", "tipoDocumentoIdentificacion": "SC"}	2025-10-14 16:53:03.966-05	2025-10-14 16:53:03.966-05
3	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 2, "vrServicio": 1680, "consecutivo": 1, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 18:30", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.928-05	2025-10-23 11:07:07.928-05
4	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 6363, "cantidadOS": 1, "vrServicio": 6363, "consecutivo": 2, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010089", "nomTecnologiaSalud": "CATETER INTRAVENOSO 18*1 1/4 - seguridad (BRAUN)", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 18:30", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.929-05	2025-10-23 11:07:07.929-05
5	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 4824, "cantidadOS": 1, "vrServicio": 4824, "consecutivo": 3, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010372", "nomTecnologiaSalud": "EQUIPO DE MACROGOTEO CON SISTEMA DE SEGURIDAD (macrogoteo de", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 18:30", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.93-05	2025-10-23 11:07:07.93-05
6	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 4824, "cantidadOS": 1, "vrServicio": 4824, "consecutivo": 4, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010372", "nomTecnologiaSalud": "EQUIPO DE MACROGOTEO CON SISTEMA DE SEGURIDAD (macrogoteo de", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 22:33", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.932-05	2025-10-23 11:07:07.932-05
7	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 66411, "cantidadOS": 1, "vrServicio": 66411, "consecutivo": 5, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010168", "nomTecnologiaSalud": "EQUIPO STANDARD PARA BOMBA DE INFUSION BAXTER / MINDRAY Ref.", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 22:33", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.933-05	2025-10-23 11:07:07.933-05
8	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 20607, "cantidadOS": 1, "vrServicio": 20607, "consecutivo": 6, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010712", "nomTecnologiaSalud": "CONECTOR ONE LINK DE FLUJO NEUTRO Ref 7N8378 BAXTER", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 22:33", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.934-05	2025-10-23 11:07:07.934-05
9	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 559, "cantidadOS": 1, "vrServicio": 559, "consecutivo": 7, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010208", "nomTecnologiaSalud": "JERINGAS DE INSULINA - con aguja 27G 1/2", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 22:33", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.935-05	2025-10-23 11:07:07.935-05
10	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 8, "vrServicio": 6720, "consecutivo": 8, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 22:33", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.936-05	2025-10-23 11:07:07.936-05
11	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 7, "vrServicio": 5880, "consecutivo": 9, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-08 12:14", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.937-05	2025-10-23 11:07:07.937-05
12	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 7, "vrServicio": 5880, "consecutivo": 10, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-09 08:15", "numDocumentoIdentificacion": "1081593391", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.938-05	2025-10-23 11:07:07.938-05
13	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 82598, "cantidadOS": 1, "vrServicio": 82598, "consecutivo": 11, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010164", "nomTecnologiaSalud": "EQUIPO FOTOSENSIBLE PARA BOMBA DE INFUSION BAXTER / MINDRAY ", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-09 12:21", "numDocumentoIdentificacion": "1089196743", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.939-05	2025-10-23 11:07:07.939-05
14	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 6363, "cantidadOS": 1, "vrServicio": 6363, "consecutivo": 12, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010089", "nomTecnologiaSalud": "CATETER INTRAVENOSO 18*1 1/4 - seguridad (BRAUN)", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-09 20:31", "numDocumentoIdentificacion": "1085330999", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.94-05	2025-10-23 11:07:07.94-05
15	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 20607, "cantidadOS": 1, "vrServicio": 20607, "consecutivo": 13, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010712", "nomTecnologiaSalud": "CONECTOR ONE LINK DE FLUJO NEUTRO Ref 7N8378 BAXTER", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-09 20:31", "numDocumentoIdentificacion": "1085330999", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.943-05	2025-10-23 11:07:07.943-05
16	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 10, "vrServicio": 8400, "consecutivo": 14, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-10 10:21", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.944-05	2025-10-23 11:07:07.944-05
17	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 6363, "cantidadOS": 1, "vrServicio": 6363, "consecutivo": 15, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010089", "nomTecnologiaSalud": "CATETER INTRAVENOSO 18*1 1/4 - seguridad (BRAUN)", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-10 13:18", "numDocumentoIdentificacion": "1193030830", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.946-05	2025-10-23 11:07:07.946-05
18	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 8, "vrServicio": 6720, "consecutivo": 16, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-10 18:46", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.947-05	2025-10-23 11:07:07.947-05
19	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 2794, "cantidadOS": 1, "vrServicio": 2794, "consecutivo": 17, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010163", "nomTecnologiaSalud": "EQUIPO EXTENSION ANESTESIA ref 473 - REF. 81020 -GLOBAL", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-10 21:44", "numDocumentoIdentificacion": "1085248539", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.948-05	2025-10-23 11:07:07.948-05
20	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 8, "vrServicio": 6720, "consecutivo": 18, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-11 13:23", "numDocumentoIdentificacion": "1085263100", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.949-05	2025-10-23 11:07:07.949-05
21	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 6363, "cantidadOS": 1, "vrServicio": 6363, "consecutivo": 19, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010089", "nomTecnologiaSalud": "CATETER INTRAVENOSO 18*1 1/4 - seguridad (BRAUN)", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-11 13:40", "numDocumentoIdentificacion": "12750466", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.95-05	2025-10-23 11:07:07.95-05
22	4	DE	VEN28249144	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 20607, "cantidadOS": 1, "vrServicio": 20607, "consecutivo": 20, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010712", "nomTecnologiaSalud": "CONECTOR ONE LINK DE FLUJO NEUTRO Ref 7N8378 BAXTER", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-11 13:40", "numDocumentoIdentificacion": "12750466", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.951-05	2025-10-23 11:07:07.951-05
23	4	DE	VEN28249144	{"tipoOS": "03", "idMIPRES": null, "vrUnitOS": 391900, "cantidadOS": 2, "vrServicio": 783800, "consecutivo": 21, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "129A02", "nomTecnologiaSalud": "INTERNACION EN SERVICIO DE COMPLEJIDAD ALTA HABITACION DE CU", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-07 23:25", "numDocumentoIdentificacion": "12750466", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.951-05	2025-10-23 11:07:07.951-05
24	4	DE	VEN28249144	{"tipoOS": "03", "idMIPRES": null, "vrUnitOS": 391900, "cantidadOS": 3, "vrServicio": 1175700, "consecutivo": 22, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "129A02", "nomTecnologiaSalud": "INTERNACION EN SERVICIO DE COMPLEJIDAD ALTA HABITACION DE CU", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-03-09 05:24", "numDocumentoIdentificacion": "12750466", "tipoDocumentoIdentificacion": "CC"}	2025-10-23 11:07:07.952-05	2025-10-23 11:07:07.952-05
25	7	DE	VEN26792185	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 6395, "cantidadOS": 1, "vrServicio": 6395, "consecutivo": 1, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010090", "nomTecnologiaSalud": "CATETER INTRAVENOSO 20*1 1/4 - seguridad (BRAUN)", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-08-10 09:09", "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.778-05	2026-02-12 09:37:55.778-05
26	7	DE	VEN26792185	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 4824, "cantidadOS": 1, "vrServicio": 4824, "consecutivo": 2, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010372", "nomTecnologiaSalud": "EQUIPO DE MACROGOTEO CON SISTEMA DE SEGURIDAD (macrogoteo de", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-08-10 09:09", "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.791-05	2026-02-12 09:37:55.791-05
27	7	DE	VEN26792185	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 840, "cantidadOS": 2, "vrServicio": 1680, "consecutivo": 3, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010209", "nomTecnologiaSalud": "JERINGAS DESECHABLES DE 10cc", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-08-10 09:09", "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.793-05	2026-02-12 09:37:55.793-05
28	7	DE	VEN26792185	{"tipoOS": "01", "idMIPRES": null, "vrUnitOS": 6363, "cantidadOS": 1, "vrServicio": 6363, "consecutivo": 4, "codPrestador": "520010110201", "conceptoRecaudo": "05", "numAutorizacion": null, "codTecnologiaSalud": "151802MQG010089", "nomTecnologiaSalud": "CATETER INTRAVENOSO 18*1 1/4 - seguridad (BRAUN)", "valorPagoModerador": 0, "numFEVPagoModerador": null, "fechaSuministroTecnologia": "2025-08-10 09:22", "numDocumentoIdentificacion": "1193472924", "tipoDocumentoIdentificacion": "CC"}	2026-02-12 09:37:55.794-05	2026-02-12 09:37:55.794-05
\.


--
-- Data for Name: prestadores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prestadores (id, nombre_departamento, cod_habilitacion, nombre_prestador, nit, razon_social, ese, direccion, telefono, fax, email, nivel, carcter, habilitado, naju_nombre, rep_legal, "createdAt", "updatedAt", muni_nombre, naju_codigo) FROM stdin;
1	Nariño	5201901434	ESE CENTRO DE SALUD SAN JOSE	900131684	ESE CENTRO DE SALUD SAN JOSE	SI	BARRIO SAN CARLOS SALIDA NORTE	092-7430131	3125739765	secretaria@esesanjosedealbannarino.gov.co	1	\N	SI	Pública	MARIA ONEIDA ALBAN ARGOTE	2025-10-06 14:53:54.445-05	2025-10-06 14:53:54.445-05	ALBÁN	4
2	Nariño	5202201506	EMPRESA SOCIAL DEL ESTADO CENTRO DE SALUD NUESTRA SEÑORA DEL PILAR ESE	900192678	EMPRESA SOCIAL DEL ESTADO CENTRO DE SALUD NUESTRA SEÑORA DEL PILAR ESE	SI	CRA. 6ª BARRIO EL PROGRESO	3122005339	\N	esealdana@gmail.com	1	\N	SI	Pública	ZANDRA MILENA REINA MENESES	2025-10-06 14:53:54.461-05	2025-10-06 14:53:54.461-05	ALDANA	4
3	Nariño	5203600988	CENTRO DE SALUD ANCUYA E.S.E.	900000410	CENTRO DE SALUD ANCUYA E.S.E.	SI	CL 1 No.5-23	3106240301	\N	gerencia@esecentrodesalud-ancuya-narino.gov.co	1	\N	SI	Pública	SILVANA CLARETH PORTILLA BASTIDAS	2025-10-06 14:53:54.464-05	2025-10-06 14:53:54.464-05	ANCUYÁ	4
4	Nariño	5205101413	E.S.E CENTRO DE SALUD SAN MIGUEL	900135676	E.S.E CENTRO DE SALUD SAN MIGUEL	SI	Barrio San Jose	3176880386	\N	contactenos@esesanmiguel-arboleda-narino.gov.co	1	\N	SI	Pública	JOHANA ALEXANDRA BOLAÑOS GONZALEZ	2025-10-06 14:53:54.467-05	2025-10-06 14:53:54.467-05	ARBOLEDA	4
5	Nariño	5207900055	ASOCIACION DE AUTORIDADES Y CABILDOS AWA UNIPA	840000269	ASOCIACION DE AUTORIDADES Y CABILDOS AWA UNIPA	NO	CORREGIMIENTO JUSTO ORTIZ	3176696602	3176696596	saludawaunipa@gmail.com	1	\N	SI	Pública	Jaime Eduardo Nastacuas Guanga	2025-10-06 14:53:54.469-05	2025-10-06 14:53:54.469-05	BARBACOAS	4
6	Nariño	5207901407	E.S.E. HOSPITAL SAN ANTONIO DE BARBACOAS	891200445	E.S.E. HOSPITAL SAN ANTONIO DE BARBACOAS	SI	BARBACOAS	3104500949	\N	hospsab@hotmail.com	1	\N	SI	Pública	TANIA PATRICIA QUIÑONES CORTES	2025-10-06 14:53:54.472-05	2025-10-06 14:53:54.472-05	BARBACOAS	4
7	Nariño	5208301384	E.S.E. CENTRO DE SALUD BELEN	814001677	E.S.E. CENTRO DE SALUD BELEN	SI	KR 1a # 1 A 124	3216068240	\N	esecsb@gmail.com	1	\N	SI	Pública	NATALIA MUÑOZ BOLAÑOS	2025-10-06 14:53:54.474-05	2025-10-06 14:53:54.474-05	BELÉN	4
8	Nariño	5211001504	E.S.E. CENTRO DE SALUD VIRGEN DE LOURDES	900142579	E.S.E. CENTRO DE SALUD VIRGEN DE LOURDES	SI	KR 4 CL 14	3208327231	\N	esevirgendelourdes@yahoo.es	1	\N	SI	Pública	MÓNICA LORENA FLÓREZ ANRANGO	2025-10-06 14:53:54.477-05	2025-10-06 14:53:54.477-05	BUESACO	4
9	Nariño	5211003362	IPS MEDIMAGEN SAS	901423438	IPS MEDIMAGEN SAS	\N	CRA 3 NO 4-42 BARRIO CENTRO NORTE	3153824121	\N	medimagencentroespecializado@gmail.com	\N	\N	SI	Privada	CARLOS ANIBAL DIAZ GUZMAN	2025-10-06 14:53:54.479-05	2025-10-06 14:53:54.479-05	BUESACO	1
10	Nariño	5224001399	E.S.E. CENTRO DE SALUD NUESTRA SEÑORA DE FÁTIMA	900134497	E.S.E. CENTRO DE SALUD NUESTRA SEÑORA DE FÁTIMA	SI	KR 9° N° 2-54 BRR PANAMERICANO	3216286787	\N	esecensaludchachagui@gmail.com	1	\N	SI	Pública	LUIS EDUARDO ARMERO ENRIQUEZ	2025-10-06 14:53:54.481-05	2025-10-06 14:53:54.481-05	CHACHAGÜÍ	4
11	Nariño	5224003282	I.P.S NOVALUZ S.A.S	901438432	IPS NOVALUZ S.A.S.	\N	VEREDA SAN FRNACISCO	3116149757	\N	ipsnovaluz@gmail.com	\N	\N	SI	Privada	JORGE MARIO GUERRERO GUERRERO	2025-10-06 14:53:54.484-05	2025-10-06 14:53:54.484-05	CHACHAGÜÍ	1
12	Nariño	5224003671	NEUROVIDA IPS REHABILITACION INTEGRAL	901692601	NEUROVIDA IPS REHABILITACIÓN INTEGRAL	\N	CARRERA 9 # 2-29 LOCAL 4	3023743867	\N	ipsneurovida@gmail.com	\N	\N	SI	Privada	BILLY DAMIAN BASTIDAS QUINTERO	2025-10-06 14:53:54.486-05	2025-10-06 14:53:54.486-05	CHACHAGÜÍ	1
13	Nariño	5220301389	E.S.E. CENTRO DE SALUD LA BUENA ESPERANZA	900136920	E.S.E. CENTRO DE SALUD LA BUENA ESPERANZA	SI	BARRIO LA PAZ	3134226450	3134226450	gerenciag@esebuenaesperanza.gov.co	1	\N	SI	Pública	EYLEN DAYANA ORDOÑEZ ARTURO	2025-10-06 14:53:54.488-05	2025-10-06 14:53:54.488-05	COLÓN	4
14	Nariño	5220700926	CENTRO DE SALUD DE CONSACA EMPRESA SOCIAL DEL ESTADO	814006732	CENTRO DE SALUD DE CONSACA EMPRESA SOCIAL DEL ESTADO	SI	Calle 3 # 8-39	3153925846 - 3146688650 - 3116633975	3137335224	gerencia@eseconsacanarino.gov.co	1	\N	SI	Pública	MARIA ALEJANDRA PANTOJA MONTERO	2025-10-06 14:53:54.49-05	2025-10-06 14:53:54.49-05	CONSACA	4
15	Nariño	5221001762	CENTRO DE SALUD SAGRADO CORAZON DE JESUS E.S.E.	900126794	CENTRO DE SALUD SAGRADO CORAZON DE JESUS E.S.E.	SI	Barrio El Centro	3155515651	\N	centrodesalud@esesagradocorazondejesus-contadero-narino.gov.co	1	\N	SI	Pública	NAYIVE IDALY DEL ROSARIO CEBALLOS VALLEJO	2025-10-06 14:53:54.493-05	2025-10-06 14:53:54.493-05	CONTADERO	4
16	Nariño	5221500902	CENTRO DE SALUD DE SAN BARTOLOME DE CORDOBA ESE	814006908	CENTRO DE SALUD DE SAN BARTOLOME DE CORDOBA ESE	SI	AV SAN BARTOLOME	3104734653	3104734653	censaludsbcordoba2018@gmail.com	1	\N	SI	Pública	MERCEDES ALICIA LOPEZ VILLARREAL	2025-10-06 14:53:54.496-05	2025-10-06 14:53:54.496-05	CÓRDOBA	4
17	Nariño	5221500494	centro de salud indigena del resguardo de males	814003254	centro de salud indigena del resguardo de males	NO	CARRERA 5 N° 6A-96 B/ KENEDY	3155515651	\N	censaim@gmail.com	1	\N	SI	Pública	YUNIER ANTONIO CHACUA CUARAN	2025-10-06 14:53:54.498-05	2025-10-06 14:53:54.498-05	CÓRDOBA	4
18	Nariño	5221501665	IPS SAGRADO CORAZON DE JESUS LTDA	900283866	IPS SAGRADO CORAZON DE JESUS LTDA	NO	KR 3 CL 4-38	3177899307	\N	sagrado4@hotmail.com	\N	\N	SI	Privada	JOAQUIN JERONIMO INAGAN MUESES	2025-10-06 14:53:54.5-05	2025-10-06 14:53:54.5-05	CÓRDOBA	1
19	Nariño	5222400914	CENTRO DE SALUD CUASPUD-CARLOSAMA EMPRESA SOCIAL DEL ESTADO	814006607	CENTRO DE SALUD CUASPUD-CARLOSAMA EMPRESA SOCIAL DEL ESTADO	SI	CRA 1 1A-16 TOMAS CIPRIANO	3183927656	\N	gerencia@esecuaspudcarlosama-narino.gov.co	1	\N	SI	Pública	HENRY ALBERTO IBARRA FIGUEROA	2025-10-06 14:53:54.502-05	2025-10-06 14:53:54.502-05	CUASPUD	4
20	Nariño	5222400108	IPS INDIGENA DE CARLOSAMA DE LA ASOCIACION DE AUTORIDADES INDIGENAS DE LOS PASTOS	814004052	IPS INDIGENA DE CARLOSAMA DE LA ASOCIACION DE AUTORIDADES INDIGENAS DE LOS PASTOS	NO	KR 2a BR SAN BERNARDO	3162298559	\N	ipsindigena-tesor@hotmail.com	1	\N	SI	Pública	HUGO BLADIMIR MARTINEZ LOPEZ	2025-10-06 14:53:54.504-05	2025-10-06 14:53:54.504-05	CUASPUD	4
21	Nariño	5222700321	ESE HOSPITAL CUMBAL	814001329	ESE HOSPITAL CUMBAL	SI	KR 12 CL 18 # 8-00	3216410433	\N	hospitalcumbal@gmail.com	1	\N	SI	Pública	OMAR HERNANDO PAGUAY VALENZUELA	2025-10-06 14:53:54.509-05	2025-10-06 14:53:54.509-05	CUMBAL	4
22	Nariño	5222703061	Fisio-Med del sur S.A.S	901374923	Fisio-Med del sur S.A.S	\N	carrera 10 # 16-28	3215893825-3178606267	0	fisiomeddelsur@gmail.com	\N	\N	SI	Privada	Luisa Fernanda Ruiz Teran	2025-10-06 14:53:54.51-05	2025-10-06 14:53:54.51-05	CUMBAL	1
23	Nariño	5222700110	IPS DEL CABILDO INDIGENA DE CHILES	900089294	IPS DEL CABILDO INDIGENA DE CHILES	NO	CHILES BARRIO 4 ESQUINAS	7752022	3105998545	ipsindigenachiles@gmail.com	1	\N	SI	Pública	ROSA MARIA PRADO RUANO	2025-10-06 14:53:54.513-05	2025-10-06 14:53:54.513-05	CUMBAL	4
24	Nariño	5222700091	IPS INTERCULTURAL INDIGENA DE LOS CABILDOS DEL GRAN CUMBAL PANAN Y MAYASQUER	814003158	IPS INTERCULTURAL INDIGENA DE LOS CABILDOS DEL GRAN CUMBAL PANAN Y MAYASQUER	NO	KR 13 # 20-55	3146558629 3135567212	\N	ipsindigenacumbal2012@gmail.com	1	\N	SI	Pública	ANGEL RAMIRO PIARPUEZAN CUAICAL	2025-10-06 14:53:54.515-05	2025-10-06 14:53:54.515-05	CUMBAL	4
25	Nariño	5222702474	ODONTOMEDIC DISTRIBUIDORES S.A.S.	900677572	odontomedicdistribuidores s.a.s	\N	TV 4 con Cra 9 B/ El Centro	3164777144	\N	odontocumbal18@gmail.com	\N	\N	SI	Privada	JOVANNI ALEXANDER FUELAGAN ALPALA	2025-10-06 14:53:54.518-05	2025-10-06 14:53:54.518-05	CUMBAL	1
26	Nariño	5223301542	E.S.E. SAN PEDRO DE CUMBITARA	900179095	E.S.E. SAN PEDRO DE CUMBITARA	SI	BR BELEN	7265543	7265544	secretaria@esesanpedro-cumbitara-narino.gov.co	1	\N	SI	Pública	MARIANA ELISABET NARVAEZ PAZ	2025-10-06 14:53:54.52-05	2025-10-06 14:53:54.52-05	CUMBITARA	4
135	Nariño	5200102130	CIREN ABA SAS	900632798	CIREN ABA SAS	\N	CARRERA 29 Nº19-45 B/ LAS CUADRAS	7226557	\N	cirenaba@hotmail.com	\N	\N	SI	Privada	ANA MILENA REYES SANTACRUZ	2025-10-06 14:53:54.815-05	2025-10-06 14:53:54.815-05	PASTO	1
27	Nariño	5225000974	Hospital Sagrado Corazón de Jesús Empresa Social del Estado de El Charco	891201108	Hospital Sagrado Corazón de Jesús Empresa Social del Estado de El Charco	SI	KR. 2 - CL. 12 ESQ.	7470036	3154015822	hscjeseelcharco@hotmail.com	1	\N	SI	Pública	KONNYC ALEJANDRA QUINTERO REINA	2025-10-06 14:53:54.523-05	2025-10-06 14:53:54.523-05	EL CHARCO	4
28	Nariño	5225003433	IPS ARTEMISA CENTRO MEDICO ESPECIALIZADO S.A.S	901534243	Artemisa centro médico especializado	\N	CARRERA 2 CALLE 6 BARRIO SAGRADO CORAZON DE JESUS	3225352041	\N	centromedicoartemisa@gmail.com	\N	\N	SI	Privada	DIANA MARCELA BONILLA BONILLA	2025-10-06 14:53:54.529-05	2025-10-06 14:53:54.529-05	EL CHARCO	1
29	Nariño	5225401388	E.S.E CENTRO DE SALUD SAN ISIDRO DE EL PEÑOL	900126464	E.S.E CENTRO DE SALUD SAN ISIDRO DE EL PEÑOL	SI	El peñol Barrio VILLA FLOR	7265422	3128501609	sanisidro_52@yahoo.es	1	\N	SI	Pública	JESSICA GERALDYNE SOSAPANTA DAZA	2025-10-06 14:53:54.532-05	2025-10-06 14:53:54.532-05	EL PEÑOL	4
30	Nariño	5225601409	ESE DE PRIMER NIVEL DE EL MUNICIPIO DE EL ROSARIO	900145604	ESE DE PRIMER NIVEL DE EL MUNICIPIO DE EL ROSARIO	SI	BARRIO LA CRUZ	3185165358	7265457	gerencia@eseelrosarionarino.gov.co	1	\N	SI	Pública	NATALIA SOLARTE GONZALES	2025-10-06 14:53:54.535-05	2025-10-06 14:53:54.535-05	EL ROSARIO	4
31	Nariño	5225801507	E.S.E. CENTRO DE SALUD DEL TABLON DE GOMEZ	900154361	E.S.E. CENTRO DE SALUD DEL TABLON DE GOMEZ	SI	SECTOR ESTADIO	3104068404	3109794282	centrosalud@esetablon.gov.co	1	\N	SI	Pública	AURA MAYELI MESA POTOSI	2025-10-06 14:53:54.538-05	2025-10-06 14:53:54.538-05	EL TABLÓN DE GÓMEZ	4
32	Nariño	5225801827	IPS-I del Pueblo Inga en Aponte	900408019	IPS-I del Pueblo Inga en Aponte	NO	Resguardo Indigena Inga de Aponte	3136006707	\N	aponteips@gmail.com	1	\N	SI	Pública	oscar alier janamejoy muñoz	2025-10-06 14:53:54.541-05	2025-10-06 14:53:54.541-05	EL TABLÓN DE GÓMEZ	4
33	Nariño	5226001436	CENTRO HOSPITAL SAN LUIS E.S.E.	900153346	CENTRO HOSPITAL SAN LUIS E.S.E.	SI	BARRIO RICAURTE CARRERA 5 CALLE 11 ESQUINA	3105868377	\N	gerencia@esecentrohospitalsanluis.gov.co	1	\N	SI	Pública	ROVEIRO HENRY LEITON CERON	2025-10-06 14:53:54.543-05	2025-10-06 14:53:54.543-05	EL TAMBO	4
34	Nariño	5226002021	I.P.S SERVICIOS ESPECIALES DE REHABILITACIÓN EN SALUD SERES S.A.S	900574215	I.P.S SERVICIOS ESPECIALES DE REHABILITACIÓN EN SALUD SERES S.A.S	\N	CARRERA 11 # 6 - 79 BARRIO RICAURTE	3154596397	\N	jannethcelis@hotmail.com	\N	\N	SI	Privada	JANETH DEL SOCORRO CELIS TIMANÁ	2025-10-06 14:53:54.546-05	2025-10-06 14:53:54.546-05	EL TAMBO	1
35	Nariño	5252001392	E.S.E. CENTRO DE SALUD SEÑOR DEL MAR	900140894	E.S.E. CENTRO DE SALUD SEÑOR DEL MAR	SI	CASCO URBANO	3104638774	\N	gerentesenordelmar@outlook.com	1	\N	SI	Pública	JUDITH ANDREA ITURRE MONTAÑO	2025-10-06 14:53:54.548-05	2025-10-06 14:53:54.548-05	FRANCISCO PIZARRO	4
36	Nariño	5228701440	CENTRO DE SALUD FUNES E.S.E.	900128655	CENTRO DE SALUD FUNES E.S.E.	SI	AV LA ESPERANZA	3112169169	3176369355	esefunes@yahoo.es	1	\N	SI	Pública	ADRIANA BRAVO MORENO	2025-10-06 14:53:54.55-05	2025-10-06 14:53:54.55-05	FUNES	4
37	Nariño	5231700660	HOSPITAL GUACHUCAL ESE	837000286	HOSPITAL GUACHUCAL ESE	SI	BARRIO 20 DE JULIO VIA CUMBAL	3162503249	3153436994	contactenos@hospital-guachucal-ese.gov.co	1	\N	SI	Pública	EDUAR FABIAN BENAVIDES ZAMBRANO	2025-10-06 14:53:54.553-05	2025-10-06 14:53:54.553-05	GUACHUCAL	4
38	Nariño	5231701009	IPS INDIGENA DEL RESGUARDO DE MUELLAMUES	900001297	IPS INDIGENA DEL RESGUARDO DE MUELLAMUES	NO	RESGUARDO INDIGENA DE MUELLAMUES	927752464	3183354603	ipsimuellamues@gmail.com	1	\N	SI	Pública	SEGUNDO ALIRIO CUASTUMAL CAIPE	2025-10-06 14:53:54.556-05	2025-10-06 14:53:54.556-05	GUACHUCAL	4
39	Nariño	5231700077	IPS-I ASOCIACION DE CABILDOS DE GUACHUCAL Y COLIMBA	814005647	IPS-I ASOCIACION DE CABILDOS DE GUACHUCAL Y COLIMBA	NO	Sector "EL CONSUELO" Via a Túquerres	3164180903	\N	ipsguachucalycolimba@gmail.com	1	\N	SI	Pública	HECTOR FIDENCIO TERMAL CUASTUMAL	2025-10-06 14:53:54.558-05	2025-10-06 14:53:54.558-05	GUACHUCAL	4
40	Nariño	5232001844	CENTRO DE REHABILITACION MANOS INTEGRALES	900429365	CENTRO DE REHABILITACION MANOS INTEGRALES	\N	CALLE ONTANEDA	3122550373	3168345845	manosintegrales@hotmail.com	\N	\N	SI	Privada	ANDREA DEL ROSARIO GONZALEZ PAREDES	2025-10-06 14:53:54.56-05	2025-10-06 14:53:54.56-05	GUAITARILLA	1
41	Nariño	5232000371	CENTRO HOSPITAL GUAITARILLA E.S.E.	814002021	CENTRO HOSPITAL GUAITARILLA E.S.E.	SI	PLAZA SANTAFE	3206742785	\N	secretaria@esecentrohospital-guaitarilla-narino.gov.co	1	\N	SI	Pública	MARLY JHOANA ROMO LUCERO	2025-10-06 14:53:54.562-05	2025-10-06 14:53:54.562-05	GUAITARILLA	4
42	Nariño	5232301390	CENTRO DE SALUD SEÑOR DE LOS MILAGROS DE GUALMATÁN - EMPRESA SOCIAL DEL ESTADO - E.S.E.	814001594	CENTRO DE SALUD SEÑOR DE LOS MILAGROS DE GUALMATÁN - EMPRESA SOCIAL DEL ESTADO - E.S.E.	SI	CARRERA 5 CALLE 8 FRENTE HOGAR INFANTIL EL PRINCIPITO	7790136	3165248714	esegualmatan@esesenordelosmilagros-gualmatan-narino.gov.co	1	\N	SI	Pública	FANNY PATRICIA ACTE RAMIREZ	2025-10-06 14:53:54.564-05	2025-10-06 14:53:54.564-05	GUALMATÁN	4
43	Nariño	5235200407	CENTRO DE SALUD ILES E.S.E.	814006632	CENTRO DE SALUD ILES E.S.E.	SI	AVENIDA IPIALES	3164935629	\N	centrodesaludilesese@yahoo.es - gerencia@centrodesaludiles.gov.co	1	\N	SI	Pública	LADY ALEXANDRA ORTIZ FUERTES	2025-10-06 14:53:54.568-05	2025-10-06 14:53:54.568-05	ILES	4
44	Nariño	5235401414	EMPRESA SOCIAL DEL ESTADO SANTIAGO APOSTOL E.S.E.	900142999	EMPRESA SOCIAL DEL ESTADO SANTIAGO APOSTOL E.S.E.	SI	Barrio Santa Rosa	3148118923	3176611258	contactenos@ese-santiagoapostol-imues.gov.co	1	\N	SI	Pública	NIVIA HERMINZA TOBAR ZAMBRANO	2025-10-06 14:53:54.571-05	2025-10-06 14:53:54.571-05	IMUÉS	4
45	Nariño	5235402463	REHABILITACIÓN DEL MOVIMIENTO IPS SAS	900984277	REHABILITACIÓN DEL MOVIMIENTO IPS SAS	\N	CALLE PRINCIPAL SECTOR JESUS DEL GRAN PODER CORREGIMIENTO DEL PEDREGAL	3216083616	\N	jonathan061092@hotmail.com	\N	\N	SI	Privada	JONNATHAN DAVID JARAMILLO SILVA	2025-10-06 14:53:54.575-05	2025-10-06 14:53:54.575-05	IMUÉS	1
46	Nariño	5235600075	ANALISIS LABORATORIO CLINICO ESPECIALIZADO S.A.S.	814000127	ANALISIS LABORATORIO CLINICO ESPECIALIZADO S.A.S.	\N	CARRERA 6 No. 24B - 08	7734200	7734200	analisisltda@hotmail.com	\N	\N	SI	Privada	LILIANA ESPERANZA GUZMAN LUCERO	2025-10-06 14:53:54.579-05	2025-10-06 14:53:54.579-05	IPIALES	1
47	Nariño	5235600097	ASOCIACION DE CABILDOS INDIGENAS ZONA IPIALES	837000096	ASOCIACION DE CABILDOS INDIGENAS ZONA IPIALES	NO	CALLE 9 N. 7-18	7254099	7254099	ipsacizi@yahoo.es	1	\N	SI	Pública	JOSE MODESTO ESTEBAN FUELPAZ GUAMA	2025-10-06 14:53:54.581-05	2025-10-06 14:53:54.581-05	IPIALES	4
48	Nariño	5235602323	BIOCLINICO DEL SUR S.A.S.	900758225	BIOCLINICO DEL SUR S.A.S.	\N	CARRERA 1 A No. 12 A -19	7256253	3164828129	bioclinicodelsur@gmail.com	\N	\N	SI	Privada	MIRIAM HIDILIA ZAMBRANO BENAVIDES	2025-10-06 14:53:54.583-05	2025-10-06 14:53:54.583-05	IPIALES	1
49	Nariño	5235601931	CENTRO DE RECONOCIMIENTO DE CONDUCTORES CERTIFICO CRC SAS	900452723	CENTRO DE RECONOCIMIENTO DE CONDUCTORES CERTIFICO CRC SAS	\N	CLL 5 ESTE No. 1N - 39 Barrio Los Chilcos	7731411	\N	certificocrc1@gmail.com	\N	\N	SI	Privada	SUSAN ALEJANDRA BACCA BURBANO	2025-10-06 14:53:54.586-05	2025-10-06 14:53:54.586-05	IPIALES	1
50	Nariño	5235600212	CLÍNICA AMÉRICA SALUD S.A.S.	837000738	CLÍNICA AMÉRICA SALUD S.A.S.	NO	KR 6a # 24 A 35	927733615	927733615	clinicaamericasalud@gmail.com	\N	\N	SI	Privada	JAIME ROBERTO PATIÑO VILLA	2025-10-06 14:53:54.588-05	2025-10-06 14:53:54.588-05	IPIALES	1
51	Nariño	5235603005	CLINICA ORAL DENTIS S.A.S	900819907	CLINICA ORAL DENTIS S.A.S.	\N	CARRERA 10 #14-10	3205617520	NA	clinicaoraldentis@gmail.com	\N	\N	SI	Privada	EDISON ERNEY MUEPAZ BENAVIDES	2025-10-06 14:53:54.59-05	2025-10-06 14:53:54.59-05	IPIALES	1
52	Nariño	5235603256	CRUZ ROJA IPS IPIALES	800030616	CRUZ ROJA COLOMBIANA UNIDAD MUNICIPAL DE IPIALES	\N	CALLE 10 NO 8-133	6027732651	\N	cruzrojaipsipiales@gmail.com	\N	\N	SI	Privada	PAHOLA ANDREA NARVAEZ REYES	2025-10-06 14:53:54.592-05	2025-10-06 14:53:54.592-05	IPIALES	1
53	Nariño	5235603250	ESPECIALIDADES SURMEDICAL I.P.S SAS	901473651	ESPECIALIDADES SURMEDICAL I.P.S SAS	\N	CALLE 10 N° 5 - 54 TORRE EMPRESARIAL CONSUL 502 - 503	7737499	\N	gerencia@surmedical.com.co	\N	\N	SI	Privada	PAOLA ANDREA GOYES RECALDE	2025-10-06 14:53:54.595-05	2025-10-06 14:53:54.595-05	IPIALES	1
54	Nariño	5235603103	FUNDACIÓN ORIÉNTAME	860049972	FUNDACION ORIENTAME	\N	Torre Empresarial Plaza Centro, Calle 10 # 5 - 54 Consultorio 208	(601) 9173500 Ext 204 - 430 - 3504997456	\N	secgeneral@orientame.org.co	\N	\N	SI	Privada	MARIA MERCEDES VIVAS PEREZ	2025-10-06 14:53:54.598-05	2025-10-06 14:53:54.598-05	IPIALES	1
55	Nariño	5235600879	FUNDACIÓN REHABILITAR NARIÑO IPS	837000997	FUNDACIÓN REHABILITAR NARIÑO IPS	NO	KR 3N #16-14	602 7750554	3154120571	rehabilitarnar@yahoo.es	\N	\N	SI	Privada	CECILIA ZAMBRANO ORTEGA	2025-10-06 14:53:54.602-05	2025-10-06 14:53:54.602-05	IPIALES	1
56	Nariño	5235600356	HOSPITAL CIVIL DE IPIALES ESE	800084362	E.S.E. HOSPITAL CIVIL DE IPIALES	SI	AVENIDA PANAMERICANA NORTE	3183975733 - 3178939200	7733949 ext 206	gerencia@hci.gov.co	2	\N	SI	Pública	EDUARDO EFRAIN NARVEZ CUJAR	2025-10-06 14:53:54.605-05	2025-10-06 14:53:54.605-05	IPIALES	4
57	Nariño	5235601166	Institucion Prestadora de Servicios de Salud Indígena Guaitara	900056747	Institucion Prestadora de Servicios de Salud Indígena Guaitara	NO	Los Chilcos	7253169	3206801063	ipsiguaitara@gmail.com	1	\N	SI	Pública	EDWIN ANDRES CUASQUER CHACUA	2025-10-06 14:53:54.607-05	2025-10-06 14:53:54.607-05	IPIALES	4
58	Nariño	5235601768	Instituto Radiologico del Sur Ipiales SAS	900350386	Instituto Radiologico del Sur Ipiales SAS	\N	CRA 5ta No 9-28	318 824 43 34	\N	irs.pasto.contabilidad@gmail.com	\N	\N	SI	Privada	JUAN CARLOS ALVEAR SALAZAR	2025-10-06 14:53:54.61-05	2025-10-06 14:53:54.61-05	IPIALES	1
59	Nariño	5235602712	IPS BIOGASTRO ESPECIALIZADA S.A.S.	901045775	IPS BIOGASTRO ESPECIALIZADA S.A.S.	\N	CALLE 10 # 5-54 PISO 3 OFICINAS 310-311-312	7733422	\N	gastrocentersas2017@gmail.com	\N	\N	SI	Privada	JOSE OCTAVIO CHAVES CHAMORRO	2025-10-06 14:53:54.612-05	2025-10-06 14:53:54.612-05	IPIALES	1
60	Nariño	5235602883	IPS CERF S.A.S	901252668	IPS CERF S.A.S	\N	Carrera 4 No. 21-80	3166596261	3176986637	ipscerf@gmail.com	\N	\N	SI	Privada	ELSY ANDREINA ORTEGA USAMAG	2025-10-06 14:53:54.614-05	2025-10-06 14:53:54.614-05	IPIALES	1
61	Nariño	5235601283	IPS CUMBE SALUD S.A.S	900106708	IPS CUMBE SALUD S.A.S	NO	Calle 26 N° 6B54 - Barrio:KENEDY	3166353502 - 3184172228	\N	ipscumbesalud@hotmail.com	\N	\N	SI	Privada	Nelsi Lorena Acosta Derazo	2025-10-06 14:53:54.617-05	2025-10-06 14:53:54.617-05	IPIALES	1
62	Nariño	5235603023	IPS DENTAL EXPERT SAS	901348643	IPS DENTAL EXPERT SAS	\N	Calle 13 No. 7-96	3186903860	7731111	paoacostav88@gmail.com	\N	\N	SI	Privada	PAOLA ANDREA ACOSTA VIRACACHA	2025-10-06 14:53:54.619-05	2025-10-06 14:53:54.619-05	IPIALES	1
63	Nariño	5235602403	IPS GENESIS CENTRO DE DIAGNOSTICO S.A.S.	900621728	IPS GENESIS CENTRO DE DIAGNOSTICO S.A.S.	\N	CALLE 24C # 5-15 ENTRADA BARRIO CHAMBU	7730074 - 3228449342	7730074	administracion@ipsgenesis.co	\N	\N	SI	Privada	GUNTHER PASCAL BURBANO VILLACIS	2025-10-06 14:53:54.621-05	2025-10-06 14:53:54.621-05	IPIALES	1
64	Nariño	5235601734	ips indígena mallamás	837000084	ips indígena mallamás	NO	CARRERA 1 NORTE No. 4-56 AV. PANAMERICANA	7255857 - 7256112	7255857	contacto@ipsmallamas.com	1	\N	SI	Pública	LUIS FERNANDO CUASTUMAL CUATIN	2025-10-06 14:53:54.623-05	2025-10-06 14:53:54.623-05	IPIALES	4
65	Nariño	5235603324	IPS KONSALUD GRUPO EMPRESARIAL SAS	901411424	IPS KONSALUD GRUPO EMPRESARIAL SAS	\N	Calle 10 5-54 Torre Empresarial plaza centro ofi 508-509	3153729654	\N	konsaludge@gmail.com	\N	\N	SI	Privada	JUAN CARLOS LOPEZ APRAEZ	2025-10-06 14:53:54.625-05	2025-10-06 14:53:54.625-05	IPIALES	1
66	Nariño	5235601503	IPS MUNICIPAL DE IPIALES E.S.E.	900190473	IPS MUNICIPAL DE IPIALES E.S.E.	SI	Calle 26 Numero 8-114	315 3600388	\N	gerencia@ipsmunicipalese.gov.co	1	\N	SI	Pública	Daniel Alberto Vallejo Florez	2025-10-06 14:53:54.626-05	2025-10-06 14:53:54.626-05	IPIALES	4
67	Nariño	5235601832	IPS NUBES VERDES DEL SUR LTDA	900418954	IPS NUBES VERDES DEL SUR LTDA	\N	CARERA 2 No. 17a-25	7752161	7752161	ipsnubesverdesl.10@gmail.com	\N	\N	SI	Privada	DARWIN GERMAN CASTILLO MORALES	2025-10-06 14:53:54.629-05	2025-10-06 14:53:54.629-05	IPIALES	1
68	Nariño	5235603463	IPS SALUD DE LOS ANDES SAS	901635330	IPS SALUD DE LOS ANDES SAS	\N	Calle 24C Carrera 6-45 Barrio Los Fundadores	3216139554	\N	ipssaluddelosandes@gmail.com	\N	\N	SI	Privada	DORIS AMANDA TAIMAL PUETATE	2025-10-06 14:53:54.632-05	2025-10-06 14:53:54.632-05	IPIALES	1
69	Nariño	5235600103	IPS UNIDAD MEDICA LTDA	837000043	IPS UNIDAD MEDICA LTDA	NO	CALLE 10 N° 4 A- 26	773 33 54	773 33 54	ipsunidadmedica1996@hotmail.com	\N	\N	SI	Privada	BAYARDO ARTURO TOVAR WOODCOCK	2025-10-06 14:53:54.635-05	2025-10-06 14:53:54.635-05	IPIALES	1
70	Nariño	5235600061	LIGA CONTRA EL CANCER CAPITULO IPIALES	837000126	LIGA CONTRA EL CANCER CAPITULO IPIALES	NO	TRANSVERSAL 3A-19-35	6027250772 3175073188	\N	ligacontraelcanceripiales@gmail.com	\N	\N	SI	Privada	GRACIELA MOTTA LOZADA	2025-10-06 14:53:54.637-05	2025-10-06 14:53:54.637-05	IPIALES	1
71	Nariño	5235603454	MEDICINA MATERNO FETAL SAS IPS	901504593	MEDICINA MATERNO FETAL SAS IPS	\N	CALLE 10 # 5-54	3165243102	\N	maternofetal.ips23@gmail.com	\N	\N	SI	Privada	ALEXANDRA MARICELA CORAL ROSERO	2025-10-06 14:53:54.64-05	2025-10-06 14:53:54.64-05	IPIALES	1
72	Nariño	5235602270	MED-IMAGENES S.A.S.	900801911	MED-IMAGENES S.A.S.	\N	CALLE 13 CARRERA 2N - 80	6027737700	\N	medimagenesrx2014@gmail.com	\N	\N	SI	Mixta	TERESA BEATRIZ CAIZA SOLIS	2025-10-06 14:53:54.643-05	2025-10-06 14:53:54.643-05	IPIALES	3
73	Nariño	5235601815	NATURAL BODY CENTER LTDA	830116823	NATURAL BODY CENTER LTDA	\N	calle 10 # 5-54 cons 401	3002183754	\N	contactenos@naturalbodycenter.com	\N	\N	SI	Privada	RICARDO ERNESTO VILLORIA DELGADO	2025-10-06 14:53:54.645-05	2025-10-06 14:53:54.645-05	IPIALES	1
74	Nariño	5235601957	OPTICA VISION	900517123	OPTICA VISION	\N	CALLE 17 - 6 - 75	7254488	\N	olimerlano@hotmail.com	\N	\N	SI	Privada	OLIMPIA MERLANO DE UNIGARRO	2025-10-06 14:53:54.647-05	2025-10-06 14:53:54.647-05	IPIALES	1
75	Nariño	5235603713	PLUSSANAR S.A.S. I.P.S.	901527530	PLUSSANAR S.A.S. I.P.S.	\N	CRA 2 A 10-109	3162911636	\N	plussanarips@gmail.com	\N	\N	SI	Privada	FRANCI YAMILLE RIVAS REVELO	2025-10-06 14:53:54.65-05	2025-10-06 14:53:54.65-05	IPIALES	1
76	Nariño	5235602579	Recuperar Salud Centro de Rehabilitación Integral S.A.S	901080824	Recuperar Salud Centro de Rehabilitación Integral S.A.S	\N	Carrera 6 # 24-28	3163996463	\N	recuperarsaludipiales@gmail.com	\N	\N	SI	Privada	David Eduardo Montenegro Vivas	2025-10-06 14:53:54.652-05	2025-10-06 14:53:54.652-05	IPIALES	1
77	Nariño	5235600890	SOCIEDAD LAS LAJAS S.A.S.	837000974	SOCIEDAD LAS LAJAS S.A.S.	NO	KR 6 # 24-122	7253750	\N	clinicalajasipiales@hotmail.com	\N	\N	SI	Privada	CARLOS JULIO GUERRERO CASTILLO	2025-10-06 14:53:54.654-05	2025-10-06 14:53:54.654-05	IPIALES	1
78	Nariño	5235602839	VHR CENTRO PEDIATRICO Y CARDIOLOGICO IPS SAS	900598579	VHR CENTRO PEDIATRICO Y CARDIOLOGICO IPS SAS	\N	CALLE 6 # 1-78 BARRIO CHAMPAGNAT	3173713430-7758600	\N	directorsalud@vhrcentropediatricoips.com	\N	\N	SI	Privada	CLAUDIA MARITZA MUÑOZ CAMPO	2025-10-06 14:53:54.656-05	2025-10-06 14:53:54.656-05	IPIALES	1
79	Nariño	5237800240	HOSPITAL EL BUEN SAMARITANO E.S.E. DEL MUNICIPIO DE LA CRUZ	891201410	HOSPITAL EL BUEN SAMARITANO E.S.E. DEL MUNICIPIO DE LA CRUZ	SI	CARRERA 12 No 10-56 BARRIO GRANADA- LA CRUZ NARIÑO	3217760894	3116652087	hbs@hospitalelbuensamaritano.gov.co	1	\N	SI	Pública	LEYDI VIVIANA MUÑOZ GOMEZ	2025-10-06 14:53:54.658-05	2025-10-06 14:53:54.658-05	LA CRUZ	4
80	Nariño	5238101502	CENTRO HOSPITAL DE LA FLORIDA EMPRESA SOCIAL DEL ESTADO	900192544	CENTRO HOSPITAL DE LA FLORIDA EMPRESA SOCIAL DEL ESTADO	SI	LA FLORIDA	3128891627	\N	gerenciahospitallaflorida@gmail.com	1	\N	SI	Pública	WILLIAM OBANDO GOMEZ	2025-10-06 14:53:54.661-05	2025-10-06 14:53:54.661-05	LA FLORIDA	4
81	Nariño	5238501829	ESE CENTRO DE SALUD SAN JUAN BOSCO	900140292	ESE CENTRO DE SALUD SAN JUAN BOSCO	SI	CARRERA 2 CALLE5 ESQUINA B/EL PROGRESO	3218448878	\N	esesjblallanada@gmail.com	1	\N	SI	Pública	YEYSON ESTID CASTELLANOS RIASCOS	2025-10-06 14:53:54.663-05	2025-10-06 14:53:54.663-05	LA LLANADA	4
82	Nariño	5239001462	EMPRESA SOCIAL DEL ESTADO CENTRO DE SALUD NUESTRA SEÑORA DEL CARMEN	900166361	EMPRESA SOCIAL DEL ESTADO CENTRO DE SALUD NUESTRA SEÑORA DEL CARMEN	SI	Kr 2 Anon Soledad	3102931967	3102931967	eselatola2019@gmail.com	1	\N	SI	Pública	MABEL YOLANDA OROBIO TELLO	2025-10-06 14:53:54.666-05	2025-10-06 14:53:54.666-05	LA TOLA	4
83	Nariño	5239903176	CENTRO DE NEURODESARROLLO Y APRENDIZAJE CRECER SAS	901408311	CENTRO DE NEURODESARROLLO Y APRENDIZAJE CRECER SAS	\N	CRA 1 No 23-14 barrio Carlos lleras	3206982270	\N	ipscrecerintegral@gmail.com	\N	\N	SI	Privada	ANGIE MELISA MARTINEZ ESPINOSA	2025-10-06 14:53:54.668-05	2025-10-06 14:53:54.668-05	LA UNIÓN	1
84	Nariño	5239900886	Centro de Salud Municipal Nivel I Luis Acosta E.S.E	814006689	Centro de Salud Municipal Nivel I Luis Acosta E.S.E	SI	BARRIO PANAMERICANO	3137970380	092-7265931	censalud@eseluisacosta-launion-narino.gov.co	1	\N	SI	Pública	ALMA JOHANA TORO ACURIA	2025-10-06 14:53:54.67-05	2025-10-06 14:53:54.67-05	LA UNIÓN	4
85	Nariño	5239903914	CLINICA DE ESPECIALIDADES GUADALUPE SAS	901916213	CLINICA DE ESPECIALIDADES GUADALUPE SAS	\N	CARRERA 2 N°2-31 BARRIO CARLOS LLERAS	3216779606	\N	calidad.ceg2025@gmail.com	\N	\N	SI	Privada	KEILY KATERINE LOPEZ DELGADO	2025-10-06 14:53:54.671-05	2025-10-06 14:53:54.671-05	LA UNIÓN	1
86	Nariño	5239903810	CLINICA NORTE ESPECIALIDADES SAS	901845291	CLINICA NORTE ESPECIALIDADES SAS	\N	CALLE 18 # 2-39 BARRIO EDUARDO SANTOS	3146282925	\N	clinicanorteespecialidades@gmail.com	\N	\N	SI	Privada	WALTER GONZALEZ MENDOZA	2025-10-06 14:53:54.674-05	2025-10-06 14:53:54.674-05	LA UNIÓN	1
87	Nariño	5239900234	E.S.E HOSPITAL EDUARDO SANTOS	891200952	E.S.E HOSPITAL EDUARDO SANTOS	SI	CRA. 2ª Nº 16-08	3147621202	\N	gerencia@hospitaleduardosantos.gov.co	2	\N	SI	Pública	PAOLA JIMENA FERNANDEZ LOPEZ	2025-10-06 14:53:54.677-05	2025-10-06 14:53:54.677-05	LA UNIÓN	4
88	Nariño	5239902027	IPS REHABILITAR DE LA UNION SAS	900576919	IPS REHABILITAR DE LA UNION SAS	\N	CRA 1 No 14-60 edificio San Carlos Barrio niño Dios	3206982270	\N	ipsrehabilitardelaunion@hotmail.com	\N	\N	SI	Privada	WILLIAM AMAURY ZAMBRANO CHAVEZ	2025-10-06 14:53:54.678-05	2025-10-06 14:53:54.678-05	LA UNIÓN	1
89	Nariño	5239901343	IPS UNIONSALUD SAS	900116413	IPS UNIONSALUD SAS	\N	Carrera 1 No. 11-65	3117435464 - 3206081740	3135254621	union_salud@hotmail.com	\N	\N	SI	Privada	EMELSY GAMBOA MUÑOZ	2025-10-06 14:53:54.68-05	2025-10-06 14:53:54.68-05	LA UNIÓN	1
90	Nariño	5239902695	UNILAB LABORATORIO CLINICO Y CITOLOGICO SAS	900895500	UNILAB LABORATORIO CLINICO Y CITOLOGICO SAS	\N	CRA 4 N° 11-14	3137464706	\N	gerencia@unilabsas.com	\N	\N	SI	Privada	LILIANA PATRICIA ORTEGA MOLINA	2025-10-06 14:53:54.682-05	2025-10-06 14:53:54.682-05	LA UNIÓN	1
91	Nariño	5240501543	ESE CENTRO DE SALUD SAN JOSE DE LEIVA	900193766	ESE CENTRO DE SALUD SAN JOSE DE LEIVA	SI	BARRIO PRADOS DEL NORTE	3229004290	3229004290	centrodesaludsanjosedeleiva@gmail.com	1	\N	SI	Pública	DAIRO DÌAZ ORTÌZ	2025-10-06 14:53:54.685-05	2025-10-06 14:53:54.685-05	LEIVA	4
92	Nariño	5241100896	E.S.E. JUAN PABLO II DEL MUNICIPIO DE LINARES	814006620	E.S.E. JUAN PABLO II DEL MUNICIPIO DE LINARES	SI	BARRIO GOLGOTA -SECTOR SAN SEBASTIAN	3175859972	3168777341	linares@esejplinaresn.gov.co	1	\N	SI	Pública	DIANA PAOLA ALVEAR ACOSTA	2025-10-06 14:53:54.686-05	2025-10-06 14:53:54.686-05	LINARES	4
93	Nariño	5241801463	E.S.E CENTRO DE SALUD DE LOS ANDES	900142446	E.S.E CENTRO DE SALUD DE LOS ANDES	SI	BARRIO SAN ISIDRO SALIDA A CUMBITARA	3183879680	3216440078	gerencia@eselosandes-sotomayor-narino.gov.co	1	\N	SI	Pública	ARVEY ALEXANDER ZAMBRANO ANDRADE	2025-10-06 14:53:54.688-05	2025-10-06 14:53:54.688-05	LOS ANDES	4
94	Nariño	5242700696	CENTRO DE SALUD SAUL QUIÑONES E.S.E.	900113729	CENTRO DE SALUD SAUL QUIÑONES E.S.E.	SI	CL PRINCIPAL	3137820534	\N	centrodesaludsaulquinonessese@gmail.com	1	\N	SI	Pública	ALEXA XIOMARA ANGULO ANGULO	2025-10-06 14:53:54.69-05	2025-10-06 14:53:54.69-05	MAGÜI	4
95	Nariño	5243500903	CENTRO DE SALUD SANTIAGO DE MALLAMA E.S.E.	814006625	CENTRO DE SALUD SANTIAGO DE MALLAMA E.S.E.	SI	PIEDRANCHA - BARRIO SANTIAGO	\N	3155055671	csantiagomallama@gmail.com	1	\N	SI	Pública	GENITH MARCELA ERAZO REALPE	2025-10-06 14:53:54.693-05	2025-10-06 14:53:54.693-05	MALLAMA	4
96	Nariño	5247301525	E.S.E. CENTRO DE SALUD SAN FRANCISCO	900167616	E.S.E. CENTRO DE SALUD SAN FRANCISCO	SI	AV LOS ESTUDIANTES	3128932416	3128932416	gerencia@esesanfrancisco.gov.co	1	\N	SI	Pública	ACEVEDO ROJAS GEOVANNY	2025-10-06 14:53:54.698-05	2025-10-06 14:53:54.698-05	MOSQUERA	4
97	Nariño	5248001387	E.S.E. CENTRO DE SALUD SAN SEBASTIAN	900127207	E.S.E. CENTRO DE SALUD SAN SEBASTIAN	SI	KR 3 # 6-49	3160516116	3160516116	csssnarino@yahoo.es	1	\N	SI	Pública	JHANNIRE ALEJANDRA MENESES RAMOS	2025-10-06 14:53:54.702-05	2025-10-06 14:53:54.702-05	NARIÑO	4
98	Nariño	5249001485	CENTRO DE SALUD CAMILO HURTDAO CIFUENTES ESE.	900127853	CENTRO DE SALUD CAMILO HURTDAO CIFUENTES ESE.	SI	Calle del Arenero, Barrio El Progreso 3	3105097618	7467177	gerencia@esecamilohurtado-olayaherrera-narino.gov.co	1	\N	SI	Pública	LUISA FERNANDA MADRID LONDOÑO	2025-10-06 14:53:54.704-05	2025-10-06 14:53:54.704-05	OLAYA HERRERA	4
99	Nariño	5249003343	IMAGENES OLAYA SAS ZOMAC	901536914	Imagenes Olaya SAS Zomac	\N	BARRIO EL NATAL - CALLE DEL ANILLO VIAL AL LADO DE REFRESCOS AQUARIUM	3154490693	\N	harry86af@hotmail.com	\N	\N	SI	Privada	Harry Miguel Cifuentes Sanchez	2025-10-06 14:53:54.709-05	2025-10-06 14:53:54.709-05	OLAYA HERRERA	1
100	Nariño	5249003163	IPS SALUD MAX SAS	901430051	SALUD MAX S.A.S.	\N	Calle Telecom	3157761932	\N	albeirotorres20181@gmail.com	\N	\N	SI	Privada	ALBEIRO TORRES GUERRERO	2025-10-06 14:53:54.712-05	2025-10-06 14:53:54.712-05	OLAYA HERRERA	1
101	Nariño	5250601433	CENTRO DE SALUD SAN MIGUEL ARCANGEL DE OSPINA ESE	900126676	CENTRO DE SALUD SAN MIGUEL ARCANGEL DE OSPINA ESE	SI	SECTOR EL TRANSITO	3174044015	3186306969	censaludospina@hotmail.com	1	\N	SI	Pública	DIALI JUDITH DOMINGUEZ CORAL	2025-10-06 14:53:54.715-05	2025-10-06 14:53:54.715-05	OSPINA	4
102	Nariño	5200101213	COOPERATIVA DE SERVICIOS INTEGRALES DE SALUD RED MEDICRON IPS	900077584	COOPERATIVA DE SERVICIOS INTEGRALES DE SALUD RED MEDICRON IPS	\N	CRA 26 #9-22 - Barrio:SAN JOSE OBRERO	3183380107	\N	notificaciones@redmedicronips.com.co	\N	\N	SI	Privada	MAURICIO VLADIMIR ENRIQUEZ VELASQUEZ	2025-10-06 14:53:54.718-05	2025-10-06 14:53:54.718-05	PASTO	1
103	Nariño	5200103896	NEUROPSICOLOGIA CLINICA PAHES SAS	901907110	NEUROPSICOLOGIA CLINICA PAHES SAS	\N	CR 29 10 35 - San Felipe	3183086879	\N	neuropsicologia.pahes@gmail.com	\N	\N	SI	Privada	ROBIN GEOVANNY FAJARDO FAJARDO	2025-10-06 14:53:54.721-05	2025-10-06 14:53:54.721-05	PASTO	1
104	Nariño	5200103610	A.M.M.I IPS SAS	901710727	A.M.M.I IPS SAS	\N	CRA 42A.N. 15-63	3002224667	\N	ammiipssas1@gmail.com	\N	\N	SI	Privada	KEVIN DAVID HERNANDEZ CANO	2025-10-06 14:53:54.725-05	2025-10-06 14:53:54.725-05	PASTO	1
105	Nariño	5200101878	AHARA IPS Y HOME CARE SAS	900452452	AHARA IPS Y HOME CARE SAS	\N	CALLE 22 # 21B- 48 AVENIDA SANTANDER	7209468	7209468	aharahomecare@hotmail.com	\N	\N	SI	Privada	CAMPO ELIAS LOPEZ BENAVIDES	2025-10-06 14:53:54.728-05	2025-10-06 14:53:54.728-05	PASTO	1
106	Nariño	5200103110	AHDENT ODONTOLOGIA ESPECIALIZADA SAS	901371529	AHDENT ODONTOLOGIA ESPECIALIZADA SAS	\N	CARRERA 25 No. 21-36	3155810345	7232076	andhuete@hotmail.com	\N	\N	SI	Privada	ANDREA JULIETTA HUETE PRADO	2025-10-06 14:53:54.73-05	2025-10-06 14:53:54.73-05	PASTO	1
107	Nariño	5200102309	AMPM24SAS	900813532	AMPM24SAS	\N	CALLE 20 No. 38-15 AVENIDA LOS ESTUDIANTES	3042045021	\N	gerencia@ampm24.co	\N	\N	SI	Privada	MONICA LILIANA ANGULO RODRIGUEZ	2025-10-06 14:53:54.733-05	2025-10-06 14:53:54.733-05	PASTO	1
108	Nariño	5200102841	AN CIRUGÍA PLÁSTICA Y ODONTOLOGÍA ESPECIALIZADA	901147012	AN CIRUGÍA PLÁSTICA Y ODONTOLOGÍA ESPECIALIZADA	\N	Cra. 42 No. 21-20	3104999956	3104999956	lismile@hotmail.com	\N	\N	SI	Privada	LISBETH MILEIDI FUERTES JURADO	2025-10-06 14:53:54.737-05	2025-10-06 14:53:54.737-05	PASTO	1
109	Nariño	5200102574	ART MEDICA SAS PASTO	900298928	ARTMEDICA S.A.S	\N	Cra 25 #16 -37 Centro medico La Casona	Línea de atencion Nacional 3009120074, WhatsApp 3245737308	\N	notificaciones@artmedica.co	\N	\N	SI	Privada	RICARDO ANTONIO PINEDA TAMAYO	2025-10-06 14:53:54.742-05	2025-10-06 14:53:54.742-05	PASTO	1
110	Nariño	5200103831	ARTE MEDICA IPS SAS	901859756	ARTE MEDICA IPS SAS	\N	CRA 34 A # 14-59 Barrio San Ignacio	3216132820	\N	artemedicaips@gmail.com	\N	\N	SI	Privada	CRISTIAN CAMILO LOZA BASANTE	2025-10-06 14:53:54.746-05	2025-10-06 14:53:54.746-05	PASTO	1
111	Nariño	5200103369	ARTEK PASTO SAS	901365309	ARTEK PASTO SAS	\N	Calle 19 # 31 C- 12 Oficina 402 403 EDIFICO NET 31	3014204747	\N	gerenciaolpasto@gmail.com	\N	\N	SI	Privada	ARTURO TIMARAN ZAMBRANO	2025-10-06 14:53:54.748-05	2025-10-06 14:53:54.748-05	PASTO	1
112	Nariño	5200100508	ASOCIACIÓN PROFAMILIA	860013779	ASOCIACIÓN PROFAMILIA	NO	KR 36 # 19-126 PALERMO	(602)7380140	\N	jorge.rojo@profamilia.org.co	\N	\N	SI	Privada	MARTA ELENA ROYO RUIZ	2025-10-06 14:53:54.752-05	2025-10-06 14:53:54.752-05	PASTO	1
113	Nariño	5200101754	AUDIOCOM PASTO	814003448	AUDIOCOM IPS	\N	Cra 42 No. 18A-94 Local 232 C.C. Valle de Atriz	(2) 736 50 72 - 3174374863	3176363751	servicio@audiocom.com.co	\N	\N	SI	Privada	JAIRO DIEGO PORTILLA TORO	2025-10-06 14:53:54.754-05	2025-10-06 14:53:54.754-05	PASTO	1
114	Nariño	5200138669	BIENESTAR ACTIVO RADIANTEZ S.A.S.	901816113	BIENESTAR ACTIVO RADIANTEZ S.A.S.	\N	Cra. 33 #20 - 27 Edificio V1501, CONS 605	3135737206	\N	bienestaractivosas@gmail.com	\N	\N	SI	Privada	EDUARD JAIR PARRA MOLINA	2025-10-06 14:53:54.758-05	2025-10-06 14:53:54.758-05	PASTO	1
115	Nariño	5200102753	BIENESTAR RESPONSABILIDAD INTEGRAL ASISTENCIAL SAS	901146590	BIENESTAR RESPONSABILIDAD INTEGRAL ASISTENCIAL SAS	\N	CARRERA 24 NUMERO 11-38 barrio santiago	3205796783	NO	briasaludips@gmail.com	\N	\N	SI	Privada	BETTY PATRICIA BOLAÑOS BURBANO	2025-10-06 14:53:54.76-05	2025-10-06 14:53:54.76-05	PASTO	1
116	Nariño	5200103837	BIOSANTE CENTRO DE MEDICINA Y BELLEZA SAS IPS	901685700	BIOSANTE CENTRO DE MEDICINA Y BELLEZA SAS IPS	\N	CARRERA 38 # 18-44 PISO 1 PALERMO	3185022226	\N	biosantefacturacion@gmail.com	\N	\N	SI	Privada	SANDRA PATRICIA SANTACRUZ ORDOÑEZ	2025-10-06 14:53:54.763-05	2025-10-06 14:53:54.763-05	PASTO	1
117	Nariño	5200103644	BONESTAR SALUD INTEGRAL SAS ZOMAC	901551175	BONESTAR SALUD INTEGRAL SAS ZOMAC	\N	Carrera 42 No 18 A- 94 Local 118 Centro Empresarial Valle de Atriz	3117770904	\N	bonestarsalud@gmail.com	\N	\N	SI	Privada	ALVARO JOSE CUARAN MEJIA	2025-10-06 14:53:54.766-05	2025-10-06 14:53:54.766-05	PASTO	1
118	Nariño	5200102338	CARDIO VITAL INSTITUTO DE CARDIOLOGIA SAS	900798611	CARDIO VITAL INSTITUTO DE CARDIOLOGIA SAS	\N	KRA 33 No 12 a 44 /Clinica san Ignacio/ tercer piso	7419056 // 320 300 50 25 // 300 379 09 93	\N	cardiovitalsas@gmail.com	\N	\N	SI	Privada	JOSE FERNANDO ARTEAGA FEUILLET	2025-10-06 14:53:54.769-05	2025-10-06 14:53:54.769-05	PASTO	1
119	Nariño	5200103355	CARDIODIAGNOSTICO PEDIATRICO IPS S.A.S	901558246	CARDIODIAGNOSTICO PEDIATRICO IPS S.A.S	\N	carrera 39 N° 19 - 120 Barrio palermo	3176611876	\N	cdpsas2@gmail.com	\N	\N	SI	Privada	LILIA EULALIA VALLEJOS BENAVIDES	2025-10-06 14:53:54.772-05	2025-10-06 14:53:54.772-05	PASTO	1
120	Nariño	5200101267	CEDIT DEL SUR SAS	900091644	CEDIT DEL SUR SAS	NO	KR 24 # 14-21 esquina	7419271	\N	gerencia@ceditdelsur.com	\N	\N	SI	Privada	FAVIAN ALEJANDRO CORDON TORRES	2025-10-06 14:53:54.775-05	2025-10-06 14:53:54.775-05	PASTO	1
121	Nariño	5200100107	CEHANI ESE	891200638	CEHANI ESE	SI	CALLE 18 No 45-49	7311906	3108793290	gerencia@cehani.gov.co	2	\N	SI	Pública	AMANDA LILIANA VIVEROS ORDOÑEZ	2025-10-06 14:53:54.778-05	2025-10-06 14:53:54.778-05	PASTO	4
122	Nariño	5200102906	CELERY GROUP SAS	901243177	CELERY GROUP SAS	\N	Carrera 37 # 19 - 26	7223102-3166411799	\N	info@celery.com.co	\N	\N	SI	Privada	Luisa Fernanda Suarez Chica	2025-10-06 14:53:54.78-05	2025-10-06 14:53:54.78-05	PASTO	1
123	Nariño	5200102342	CENTRO CARDIOPULMONAR PASTO	900851200	CENTRO CARDIOPULMONAR PASTO	\N	Carrera 32 No. 13- 33	3185309688	7364948	gerencia@grupocardiopulmonar.com	\N	\N	SI	Privada	JOHN JAMES CASTILLO VERGARA	2025-10-06 14:53:54.783-05	2025-10-06 14:53:54.783-05	PASTO	1
124	Nariño	5200101312	CENTRO DE APOYO TERAPEUTICO REHABILITAR SAS	900105596	CENTRO DE APOYO TERAPEUTICO REHABILITAR SAS	NO	Carrera 30 No. 21-33	7361312	3014392156	ipsrehabilitar@yahoo.es	\N	\N	SI	Privada	ADRIANA JAQUELINE HUERTAS FIGUEROA	2025-10-06 14:53:54.785-05	2025-10-06 14:53:54.785-05	PASTO	1
125	Nariño	5200102345	CENTRO DE CUIDADOS CARDIONEUROVASCULARES PABON SAS	900900155	CENTRO DE CUIDADOS CARDIONEUROVASCULARES PABON SAS	\N	CARRERA 33No.12A-44 EDIFICIO CLINICA SAN IGNACIO	3176581279-3168319687 0327297016 ext 701	\N	gerencia.clinicardiopabon@gmail.com	\N	\N	SI	Privada	JORGE ERNEY MONCAYO CHAPID	2025-10-06 14:53:54.791-05	2025-10-06 14:53:54.791-05	PASTO	1
126	Nariño	5200102473	CENTRO DE DIAGNOSTICO INTEGRAL FETAL SAS	900865853	CENTRO DE DIAGNOSTICO INTEGRAL FETAL SAS	\N	CARRERA 33 No. 20 - 27 EDIFICIO V1501 CONSULTORIO 901.	7239933 - 3214325791 - 3176246647	\N	info@cedif.co	\N	\N	SI	Privada	ANDREA JIMENA TOBAR ERASO	2025-10-06 14:53:54.794-05	2025-10-06 14:53:54.794-05	PASTO	1
127	Nariño	5200102933	CENTRO DE ESPECIALIDADES MEDICAS INTEGRALES DE COLOMBIA SAS ZOMAC	901290010	CENTRO DE ESPECIALIDADES MEDICAS INTEGRALES DE COLOMBIA SAS ZOMAC	\N	CARRERA 34 # 8 - 24 BARRIO LAS ACACIAS	3188352703	\N	cemicips@gmail.com	\N	\N	SI	Privada	OSCAR ALEJANDRO NARVAEZ FLOREZ	2025-10-06 14:53:54.797-05	2025-10-06 14:53:54.797-05	PASTO	1
128	Nariño	5200102869	CENTRO DE ESPECIALISTAS NUTRICION DIABETES OBESIDAD Y OSTEOPOROSIS S.A.S.	901224558	CENTRO DE ESPECIALISTAS NUTRICION DIABETES OBESIDAD Y OSTEOPOROSIS S.A.S.	\N	CARRERA 31 NO 19 A 10 SEGUNDO Y QUINTO PISO	3128432642	NA	cendosas@gmail.com	\N	\N	SI	Privada	HAROLD FERNANDO MERA GARCIA	2025-10-06 14:53:54.8-05	2025-10-06 14:53:54.8-05	PASTO	1
129	Nariño	5200101764	CENTRO DE NEUROREHABILITACION JUNTOS LIMITADA	900347736	CENTRO DE NEUROREHABILITACION JUNTOS LIMITADA	\N	CARRERA 40 #18 - 46 BARRIO PALERMO	3183741025	\N	cjuntospasto@hotmail.com	\N	\N	SI	Privada	MAYRA ANDREA AYALA IBARRA	2025-10-06 14:53:54.803-05	2025-10-06 14:53:54.803-05	PASTO	1
130	Nariño	5200101906	CENTRO DE RADIOLOGIA Y ORAL Y MAXILOFACIAL ORTHOMAX SAS	900457001	CENTRO DE RADIOLOGIA Y ORAL Y MAXILOFACIAL ORTHOMAX SAS	\N	Carrera 25 No 19-45 Cilindro Sebastian de Belalcazar Oficina 304	7292786	7335290	orthomax1@hotmail.com	\N	\N	SI	Privada	Astrid Amanda Melo Maya	2025-10-06 14:53:54.805-05	2025-10-06 14:53:54.805-05	PASTO	1
131	Nariño	5200101938	CENTRO DE RECONOCIMIENTO DE CONDUCTORES CRC CERTIFICAMOS SAS	900382947	CENTRO DE RECONOCIMIENTO DE CONDUCTORES CRC CERTIFICAMOS SAS	\N	Carrera 19 - 18 -48	7202498	\N	elizarba@hotmail.com	\N	\N	SI	Privada	ELIZABETH ARCINIEGAS BAZANTE	2025-10-06 14:53:54.806-05	2025-10-06 14:53:54.806-05	PASTO	1
132	Nariño	5200102167	CENTRO DE REHABILITACION Y TERAPIAS INTEGRALES SAS	900721733	CENTRO DE REHABILITACION Y TERAPIAS INTEGRALES SAS	\N	CALLE 16 B N° 32-31 - Barrio:MARIDIAZ	7385025 - 3105384435	\N	cedertis@hotmail.com	\N	\N	SI	Privada	JAIRO ANDRES PORTILLA MONTENEGRO	2025-10-06 14:53:54.809-05	2025-10-06 14:53:54.809-05	PASTO	1
133	Nariño	5200101012	CENTRO MEDICO VALLE DE ATRIZ SAS	830504400	CENTRO MEDICO VALLE DE ATRIZ SAS	NO	CL 16 No. 29-63	7317026	7317027	asgerenciaclinicavalledeatriz@gmail.com mongekarim@gmail.com	\N	\N	SI	Privada	LUIS ALBERTO MONGE MUÑOZ	2025-10-06 14:53:54.811-05	2025-10-06 14:53:54.811-05	PASTO	1
134	Nariño	5200100205	CENTRO ODONTOLOGICO ESPECIALIZADO LTDA	814002419	CENTRO ODONTOLOGICO ESPECIALIZADO LTDA	NO	CARRERA 32A N. 20-69 AVENIDA DE LOS ESTUDIANTES	7317730	7335290	coelimitada@gmail.com	\N	\N	SI	Privada	NELSON EDUARDO ROSERO GARCIA	2025-10-06 14:53:54.813-05	2025-10-06 14:53:54.813-05	PASTO	1
136	Nariño	5200100667	CLINICA BELLATRIZ S.A.S	814004714	CLINICA BELLATRIZ S.A.S	\N	Kr 40 A # 19 A-087 PANDIACO	7312493	\N	calidad@bellatriz.com	\N	\N	SI	Privada	LIBARDO CLEMENTE VALLEJO CEBALLOS	2025-10-06 14:53:54.818-05	2025-10-06 14:53:54.818-05	PASTO	1
137	Nariño	5200102063	CLINICA CARDIONEUROVASCULAR PABON SAS	900597845	CLINICA CARDIONEUROVASCULAR PABON SAS	\N	CARRERA 33 - 12 A - 44 PISO 3 BARRIO LA AURORA	7297016	3168319687	gerencia.clinicardiopabon@gmail.com	\N	\N	SI	Privada	JORGE ERNEY MONCAYO CHAPID	2025-10-06 14:53:54.821-05	2025-10-06 14:53:54.821-05	PASTO	1
138	Nariño	5200103618	CLINICA CRYSTAL SAS	901701063	CLINICA CRYSTAL SAS	\N	CRA 42 # 18A 94 CENTRO EMPRESARIAL VALLE DE ATRIZ LOCAL 262	3160556144	\N	clinicacrystalsas@gmail.com	\N	\N	SI	Privada	ADRIANA LEONOR PORTILLO CALVACHE	2025-10-06 14:53:54.824-05	2025-10-06 14:53:54.824-05	PASTO	1
139	Nariño	5200103614	CLINICA DE ESPECIALIDADES SANTA MARIA IPS SAS	901738410	CLINICA DE ESPECIALIDADES SANTA MARIA IPS SAS	\N	CALLE 18 No. 38 - 10 Palermo	3206901302	\N	clinicasantamariaips@gmail.com	\N	\N	SI	Privada	Mario Andres Guevara Burbano	2025-10-06 14:53:54.826-05	2025-10-06 14:53:54.826-05	PASTO	1
140	Nariño	5200100829	CLINICA DE ORTOPEDIA Y FRACTURAS TRAUMEDICAL S.A.S	814006170	CLINICA DE ORTOPEDIA Y FRACTURAS TRAUMEDICAL S.A.S	NO	Carrera 37 No. 18-79	3188136012	6027244426	direccionmedica@traumedical.co	\N	\N	SI	Privada	GERARDO ANDRES ORTIZ RIVERA	2025-10-06 14:53:54.828-05	2025-10-06 14:53:54.828-05	PASTO	1
141	Nariño	5200103673	CLINICA MARIA CONSTANZA MAYA S.A.S	901656334	CLINICA MARIA CONSTANZA MAYA S.A.S	\N	CRA 35A No 20-10 CENTRO MEDICO LA RIVIERA	3218467309	\N	gerencia@mariaconstanzamaya.com	\N	\N	SI	Privada	MARIA CONSTANZA MAYA APRAEZ	2025-10-06 14:53:54.83-05	2025-10-06 14:53:54.83-05	PASTO	1
142	Nariño	5200100279	CLINICA NUESTRA SEÑORA DE FATIMA S.A.	891200032	CLINICA NUESTRA SEÑORA DE FATIMA S.A.	NO	CALLE 21 NUMERO 26 40	7333630	7333656	gerencia@clinicafatima.co	\N	\N	SI	Privada	MARIA JOSE ERASO SANTACRUZ	2025-10-06 14:53:54.834-05	2025-10-06 14:53:54.834-05	PASTO	1
143	Nariño	5200102263	CLINICA ODENTIS 24 HORAS SAS	900684525	CLINICA ODENTIS 24 HORAS SAS	\N	CALLE 12 No. 21-61 AVENIDA BOYACA	7231113-3173720262-3155555688	\N	contacto@odentisips.com	\N	\N	SI	Privada	NANCY PAOLA ORTIZ ZARAMA	2025-10-06 14:53:54.839-05	2025-10-06 14:53:54.839-05	PASTO	1
144	Nariño	5200102144	clinica odontologica orthoestetica dental sas	900696285	clinica odontologica orthoestetica dental sas	\N	CALLE 20 24 37 EDIFICIO TORO VILLOTA	7334748	7334748	orthoesteticadental@yahoo.com	\N	\N	SI	Privada	CLAUDIA YANETH PEÑA MARTINEZ	2025-10-06 14:53:54.844-05	2025-10-06 14:53:54.844-05	PASTO	1
145	Nariño	5200102312	CLINICA ODONTOLOGICA SMILE IPS SAS	900823774	CLINICA ODONTOLOGICA SMILE IPS SAS	\N	Carrera 25 Número 20-65 Local 205A	3216425714-7225025	7225025	clinica.smileips@gmail.com	\N	\N	SI	Privada	GINA PATRICIA MUÑOZ URBANO	2025-10-06 14:53:54.846-05	2025-10-06 14:53:54.846-05	PASTO	1
146	Nariño	5200100292	CLINICA OFTALMOLOGICA PAREDES SAS	800184080	CLINICA OFTALMOLOGICA PAREDES SAS	NO	KR 40A# 19B-15 AV PANAMERICANA ED TORRE PRAGA CENTRO MEDICO	3009109906	\N	cartera@clinicaparedes.com.co auxgerencia@clinicaparedes.com.co	\N	\N	SI	Privada	JUAN FELIPE SAA LORA	2025-10-06 14:53:54.849-05	2025-10-06 14:53:54.849-05	PASTO	1
147	Nariño	5200100296	CLINICA OFTALMOLOGICA UNIGARRO LIMITADA	800067316	CLINICA OFTALMOLOGICA UNIGARRO LIMITADA	NO	KR25 No. 15 - 62 PI 4	927244427	927244427	clinicaoftalunigarro@hotmail.com	\N	\N	SI	Privada	JUAN PABLO UNIGARRO ORTIZ	2025-10-06 14:53:54.852-05	2025-10-06 14:53:54.852-05	PASTO	1
148	Nariño	5200101979	CLINICA ONCOLOGICA AURORA SAS	900442870	CLINICA ONCOLOGICA AURORA SAS	\N	CRA. 34 No. 11A 12 piso 2-3-4-5	7374145	7374145	gerencia@medinuclearsas.com	\N	\N	SI	Privada	Javier Jesus Paz Mora	2025-10-06 14:53:54.854-05	2025-10-06 14:53:54.854-05	PASTO	1
149	Nariño	5200102283	CLINICA SOL DE LOS ANDES SAS	900812655	CLINICA SOL DE LOS ANDES SAS	\N	CALLE 14 # 25 - 87 - Barrio:CENTRO	3007055971	\N	INFO@SOLDELOSANDES.CO	\N	\N	SI	Privada	Juan Felipe Moncayo Marquez	2025-10-06 14:53:54.856-05	2025-10-06 14:53:54.856-05	PASTO	1
150	Nariño	5200101453	CLINICAL SPA CIRUGIA PLASTICA & LASER LTDA	900047319	CLINICAL SPA CIRUGIA PLASTICA & LASER LTDA	NO	KR 41 # 17 A 95	7317070 3168746354	7317070	adrianaportillo@clinicalspa.com.co	\N	\N	SI	Privada	JOSE GUILLERMO RODRIGUEZ ROSAS	2025-10-06 14:53:54.858-05	2025-10-06 14:53:54.858-05	PASTO	1
151	Nariño	5200102047	COMPAÑIA OPERADORA CLINICA HISPANOAMERICA SAS	900335691	COMPAÑIA OPERADORA CLINICA HISPANOAMERICA SAS	\N	CARRERA 41 No 19 D 147	7382280	7382223	gerencia@clinicahispanoamerica.com.co	\N	\N	SI	Privada	MIRIAM DEL CARMEN ARTEAGA OJEDA	2025-10-06 14:53:54.861-05	2025-10-06 14:53:54.861-05	PASTO	1
152	Nariño	5200102580	COMPLEMEDICA SAS	901079938	COMPLEMEDICA SAS	\N	CRA.30 No. 19A-04 LAS CUADRAS	3123614586	3123615095	complemedica@hotmail.com	\N	\N	SI	Privada	VILMA MAGDALY GUERRERO BENAVIDES	2025-10-06 14:53:54.865-05	2025-10-06 14:53:54.865-05	PASTO	1
153	Nariño	5200101923	CORPORACIÓN PARA LA SALUD INTEGRAL S.A.S. - CORPOSALUD S.A.S.	900335692	CORPORACIÓN PARA LA SALUD INTEGRAL S.A.S. - CORPOSALUD S.A.S.	\N	CRA 32 # 17-32	7336701	\N	gerencia@corposaludsas.com	\N	\N	SI	Privada	ELENA JAQUELINE MADROÑERO PAZ	2025-10-06 14:53:54.868-05	2025-10-06 14:53:54.868-05	PASTO	1
154	Nariño	5200101575	COSMOIMAGEN LTDA	900193475	COSMOIMAGEN LTDA	NO	carrera 31 No.20- 03 segundo piso barrio las cuadras	7227846	3172418540	rxcosmoimagen@gmail.com	\N	\N	SI	Privada	JESUS ALFONSO SOLARTE SOLARTE	2025-10-06 14:53:54.871-05	2025-10-06 14:53:54.871-05	PASTO	1
155	Nariño	5200100261	CRUZ ROJA COLOMBIANA SECCIONAL NARIÑO	891200372	CRUZ ROJA COLOMBIANA SECCIONAL NARIÑO	\N	Carrera 25 No. 13-26	7292886	7297429	presidencianarino@cruzrojacolombiana.org	\N	\N	SI	Privada	NUBYA CECILIA QUINTERO DE AREVALO	2025-10-06 14:53:54.873-05	2025-10-06 14:53:54.873-05	PASTO	1
156	Nariño	5200103679	D.VCLINIC LAB S.A.S	901569715	D.V CLINIC LAB SAS	\N	CARRERA 25 NUMERO 16 - 37 CENTRO MEDICO LA CASONA LOCAL 108	3147704738	\N	calidad@dvcliniclab.com.co	\N	\N	SI	Privada	Diego Alejandro Villamizar Gallardo	2025-10-06 14:53:54.875-05	2025-10-06 14:53:54.875-05	PASTO	1
157	Nariño	5200102354	DENTIX COLOMBIA SAS	900759454	DENTIX COLOMBIA SAS	\N	Calle 19 No.25-47	3156033463	\N	notificacionesdentix@dentix.co	\N	\N	SI	Privada	MARIA DEL PILAR ROCA GALLARDO	2025-10-06 14:53:54.877-05	2025-10-06 14:53:54.877-05	PASTO	1
158	Nariño	5200101954	DERMOPLASTIKA S.A.S.	900471364	DERMOPLASTIKA S.A.S.	\N	CARRERA 34 No. 8-34	7293053	7296725	tamara_1_co@hotmail.com	\N	\N	SI	Privada	DÉBORA GUERRERO CARRIÓN	2025-10-06 14:53:54.88-05	2025-10-06 14:53:54.88-05	PASTO	1
159	Nariño	5200103340	DIAGNOSTIK LAB CLINIC S.A.S	901455902	DIAGNOSTIK LAB CLINIC S.A.S	\N	Cr 25 no 16 - 37	3330333620	\N	coordinacion.contable@diagnostiklabclinic.com	\N	\N	SI	Privada	ALEXANDER NEIRA MEDINA	2025-10-06 14:53:54.884-05	2025-10-06 14:53:54.884-05	PASTO	1
160	Nariño	5200101102	E.S.E. HOSPITAL UNIVERSITARIO DEPARTAMENTAL DE NARIÑO	891200528	E.S.E. HOSPITAL UNIVERSITARIO DEPARTAMENTAL DE NARIÑO	SI	Calle 22 No. 7-93 parque Bolivar	7333400	7333422	hudn@hosdenar.gov.co	3	\N	SI	Pública	ANTONIO JOSE VEIRA DEL CASTILLO	2025-10-06 14:53:54.887-05	2025-10-06 14:53:54.887-05	PASTO	4
161	Nariño	5200101457	EMPRESA SOCIAL DEL ESTADO PASTO SALUD E.S.E.	900091143	EMPRESA SOCIAL DEL ESTADO PASTO SALUD E.S.E.	SI	DIAGONAL 12 A No. 3A-19 - Barrio:LA ROSA	7207183	7215942	dosur@pastosaludese.gov.co	1	\N	SI	Pública	DIEGO FERNANDO MORALES ORTEGON	2025-10-06 14:53:54.889-05	2025-10-06 14:53:54.889-05	PASTO	4
162	Nariño	5200100194	FUNDACION AMPARO SAN JOSE	800020591	FUNDACION AMPARO SAN JOSE	NO	CALLE 26 # 2-155 BARRIO CAROLINA	7302316	7302316	GERENCIAAMPAROSANJOSE@HOTMAIL.COM	\N	\N	SI	Privada	JUAN CARLOS BARRAGAN BECHARA	2025-10-06 14:53:54.891-05	2025-10-06 14:53:54.891-05	PASTO	1
163	Nariño	5200101344	FUNDACION CENTRO DE OBESIDAD Y METABOLISMO COMETA	900054747	FUNDACION CENTRO DE OBESIDAD Y METABOLISMO COMETA	NO	Carrera 36 # 19-94 Palermo	3163224711	3163224711	investigacioncometa@gmail.com	\N	\N	SI	Privada	MARIA CONSUELO CASTRO CORDOBA	2025-10-06 14:53:54.892-05	2025-10-06 14:53:54.892-05	PASTO	1
164	Nariño	5200102400	fundacion centro de rehabilitacion funcional praxis	900936382	fundacion centro de rehabilitacion funcional praxis	\N	Carrera 37 No. 18 - 107 Palermo	7364973	3166296167	gerente.praxisips@gmail.com	\N	\N	SI	Privada	ANDREA CRISTINA CAICEDO NARVAEZ	2025-10-06 14:53:54.895-05	2025-10-06 14:53:54.895-05	PASTO	1
165	Nariño	5200103496	FUNDACION CONEXION SALUD MAESVI	901645134	fundacion conexion salud	\N	Calle 13 No. 30A - 26 - Barrio:San Ignacio	3016012706 - 3104263556	\N	gerenciaconexionsalud1@gmail.com	\N	\N	SI	Privada	LUCY CAROLINA SUAREZ VILLAMARIN	2025-10-06 14:53:54.897-05	2025-10-06 14:53:54.897-05	PASTO	1
166	Nariño	5200100557	FUNDACION HOSPITAL SAN PEDRO	891200209	FUNDACION HOSPITAL SAN PEDRO	NO	CL16 KR43 ESQ	7336000 ext 308	\N	gerencia@hospitalsanpedro.org	\N	\N	SI	Privada	OSCAR ALBERTO MOSQUERA DAZA	2025-10-06 14:53:54.899-05	2025-10-06 14:53:54.899-05	PASTO	1
167	Nariño	5200100121	FUNDACION MARIA FORTALEZA	814000463	FUNDACION MARIA FORTALEZA	NO	CARRERA 38 No 19 41 BARRIO PALERMO	3155901642	7213256	mariafortaleza@hotmail.com	\N	\N	SI	Privada	SANDRA PATRICIA ARTURO D?VRIES	2025-10-06 14:53:54.902-05	2025-10-06 14:53:54.902-05	PASTO	1
168	Nariño	5200100714	FUNDACION OFTALMOLOGICA DE NARIÑO	814002261	FUNDACION OFTALMOLOGICA DE NARIÑO	NO	CARRERA 36 # 3 OESTE 70 BARRIO: COLON	7382164	7382164	planeacion@fundonar.com	\N	\N	SI	Privada	AIDA EUGENIA CONTRERAS MEZA	2025-10-06 14:53:54.905-05	2025-10-06 14:53:54.905-05	PASTO	1
169	Nariño	5200102248	Fundación para el Servicio Integral de Atención Médica - Fundación SIAM	900034438	Fundación para el Servicio Integral de Atención Médica - Fundación SIAM	\N	Avenida panamericana carrera 42 No. 18 A -94 consultorio 147 148 y 149	3176426412	7315915	calidad@fundacionsiam.org	\N	\N	SI	Privada	ANTONIO NOVER MENDOZA CASTILLO	2025-10-06 14:53:54.907-05	2025-10-06 14:53:54.907-05	PASTO	1
170	Nariño	5200103868	Fundación Para La Inclusión Social EDINFI	901324363	Fundación Para La Inclusión Social EDINFI	\N	Cra 32A #4 Oeste 27- Barrio El Bosque	3023850549	\N	contacto@edinfi.org	\N	\N	SI	Privada	Willian Giovanny Arevalo Estrada	2025-10-06 14:53:54.908-05	2025-10-06 14:53:54.908-05	PASTO	1
171	Nariño	5200102421	FUNDACION PARA LA PROMOCION DE LA SALUD Y PREVENCION DE LA ENFERMEDAD RENAL	805031507	FUNDACION PARA LA PROMOCION DE LA SALUD Y PREVENCION DE LA ENFERMEDAD RENAL	\N	carrera 25 # 16 - 37	3156466212	\N	gerenciafinanciera@prevrenal.org	\N	\N	SI	Privada	Carlos Hernan Mejia García	2025-10-06 14:53:54.91-05	2025-10-06 14:53:54.91-05	PASTO	1
172	Nariño	5200100852	FUNDACION SOCIAL GUADALUPE	800085459	FUNDACION SOCIAL GUADALUPE	\N	CALLE 18 No 13-33	7214698	7211830	funguadalupe@hotmail.com	\N	\N	SI	Privada	NELLY FAJARDO DE CEBALLOS	2025-10-06 14:53:54.912-05	2025-10-06 14:53:54.912-05	PASTO	1
173	Nariño	5200102668	FUNDACION VISTA PARA TODOS PASTO	900692403	fundación vista para todos	\N	CRA 22 No 10B-27 AV BOYACA	3105748973	\N	fundacionvistaparatodospasto@gmail.com	\N	\N	SI	Privada	RITA ENELIA BASTIDAS LEON	2025-10-06 14:53:54.914-05	2025-10-06 14:53:54.914-05	PASTO	1
174	Nariño	5200103264	GINECOLOGOS DEL SUR SAS	900512814	GINECOLOGOS DEL SUR SAS	\N	cr 42 n 18a 94 local 238	3154125400	\N	ginecologosur@gmail.com	\N	\N	SI	Privada	EDGARDO JULIAN BENAVIDES ARCOS	2025-10-06 14:53:54.917-05	2025-10-06 14:53:54.917-05	PASTO	1
175	Nariño	5200100042	GLICOL Y CIA SAS	814002169	GLICOL Y CIA SAS	NO	KR 29 # 19-29 local 108 Edf. Punto Centro	3113447477	7416593	subgerenciaglicol@gmail.com	\N	\N	SI	Privada	GLORIA INES CALPA OLIVA	2025-10-06 14:53:54.919-05	2025-10-06 14:53:54.919-05	PASTO	1
176	Nariño	5200100691	GLOBAL VISION CENTER SAS	814005766	GLOBAL VISION CENTER SAS	\N	CALLE 20 No. 38-32 AVENIDA DE LOS ESTUDIANTES	3106416206	\N	gvisioncenter@gmail.com	\N	\N	SI	Privada	JUAN MANUEL DE LOS RIOS DELGADO	2025-10-06 14:53:54.922-05	2025-10-06 14:53:54.922-05	PASTO	1
177	Nariño	5200102731	Hemato Oncólogos S.A.	805017350	HEMATO ONCOLOGOS S.A.	\N	CARRERA 42 NO. 18A - 94 PISO 2 LOCAL 245	3102988868	\N	calidad@hematooncologos.com	\N	\N	SI	Privada	GERARDO ORTIZ HUERGO	2025-10-06 14:53:54.923-05	2025-10-06 14:53:54.923-05	PASTO	1
178	Nariño	5200101114	HNAS. HOSPITALARIAS DEL SAGDO. CORAZON DE JESUS HOSPITAL MENTAL NUESTRA SRA. DEL PERPETUO SOCORRO	860007760	HERMANAS HOSPITALARIAS DEL SAGRADO CORAZÓN DE JESÚS	NO	KR 33 # 5 OESTE 104	7235685	7238947	gerencia@hospitalperpetuosocorro.org	\N	\N	SI	Privada	ANGELICA CLEOFE FLORES GARCIA	2025-10-06 14:53:54.925-05	2025-10-06 14:53:54.925-05	PASTO	1
179	Nariño	5200101905	HOME HEALTH SALUD EN CASA SAS IPS PASTO	900355304	HOME HEALTH SALUD EN CASA SAS IPS	\N	Carrera 39A #16b-45 SANTA ANA	3168787853	\N	vmauricio.ordonez@gmail.com	\N	\N	SI	Privada	VICTOR MAURICIO ORDOÑEZ MARTINEZ	2025-10-06 14:53:54.928-05	2025-10-06 14:53:54.928-05	PASTO	1
180	Nariño	5200100283	HOSPITAL INFANTIL LOS ANGELES	891200240	HOSPITAL INFANTIL LOS ANGELES	NO	KR 32 # 21 A 30	7336400 7311533	7311370	correspondencia@correohila.org	\N	\N	SI	Privada	DORIS LUCIA SARASTY RODRIGUEZ	2025-10-06 14:53:54.93-05	2025-10-06 14:53:54.93-05	PASTO	1
181	Nariño	5200100096	HOSPITAL SAN RAFAEL DE PASTO	891200274	HOSPITAL SAN RAFAEL DE PASTO	NO	Calle 15 No. 42 C -35	7362680	\N	hsrpasto@hospitalsanrafaelpasto.com	\N	\N	SI	Privada	YAMILE XIMENA DEVIA DE LA HOZ	2025-10-06 14:53:54.932-05	2025-10-06 14:53:54.932-05	PASTO	1
182	Nariño	5200102401	IMAGENES DR. FREYRE SAS	900944198	IMAGENES DR. FREYRE SAS	\N	CARRERA 33 No 12 A - 44 CONSULTORIO 201	7316293 - 7207172 - 3135567635	\N	idfreyrecomercial@gmail.com	\N	\N	SI	Privada	Maria Nathalia Freyre Arturo	2025-10-06 14:53:54.934-05	2025-10-06 14:53:54.934-05	PASTO	1
183	Nariño	5200103528	IMAGENES GALERAS SAS	901483616	IMAGENES GALERAS SAS	\N	CRA. 24 N. 20-58 Oficina 437	3186527698	\N	imagal2021@gmail.com	\N	\N	SI	Privada	ANGIE NAYIVE NAVARRO ERASO	2025-10-06 14:53:54.936-05	2025-10-06 14:53:54.936-05	PASTO	1
184	Nariño	5200102737	INAUDIO S.A.S	900096460	INAUDIO S.A.S.	\N	CALLE 18 N. 36 - 30 EDIFICIO ASTURIAS - PRIMER PISO	3128670488	\N	inaudioltda@yahoo.com	\N	\N	SI	Privada	DUNIA XIMENA PAREDES AGUIRRE	2025-10-06 14:53:54.938-05	2025-10-06 14:53:54.938-05	PASTO	1
185	Nariño	5200100861	INSTITUTO CANCEROLÓGICO DE NARIÑO S.A.S.	814006009	INSTITUTO CANCEROLÓGICO DE NARIÑO S.A.S.	NO	KR 40 A # 19 B 55	7230999, 7332117, 3182392931	\N	administracion@icnsas.com	\N	\N	SI	Privada	SILVIA ADRIANA PAZ BASTIDAS	2025-10-06 14:53:54.941-05	2025-10-06 14:53:54.941-05	PASTO	1
186	Nariño	5200102521	INSTITUTO CARDIOVASCULAR DE NARIÑO SAS	900694258	INSTITUTO CARDIOVASCULAR DE NARIÑO SAS	\N	CARRRERA 33 # 12 A 44 CONS 407 CLINICA SAN IGNACIO	7315712- 3128725832	7315712	icvn4@hotmail.com	\N	\N	SI	Privada	CARLOS MAURICIO AUX REVELO	2025-10-06 14:53:54.944-05	2025-10-06 14:53:54.944-05	PASTO	1
187	Nariño	5200101988	INSTITUTO DE DIAGNOSTICO MEDICO S.A.	800065396	INSTITUTO DE DIAGNOSTICO MEDICO S.A.	\N	Carrera 32 No.13-30	3229080444, 3105524669	\N	legal@idime.com.co, contabilidad@idime.com.co, notificaciones.calidad@idime.com.co	\N	\N	SI	Privada	LIDA YAMILE GONZALEZ BOLIVAR	2025-10-06 14:53:54.946-05	2025-10-06 14:53:54.946-05	PASTO	1
188	Nariño	5200102477	INSTITUTO LATINOAMERICANO DE INVESTIGACIONES ONCOLOGICAS SAS	900939033	INSTITUTO LATINOAMERICANO DE INVESTIGACIONES ONCOLOGICAS SAS	\N	CALLE22 NUMERO 41-38 BARRIO MORASURCO	3122173939	5800738	calidad@iliosgroup.com.co	\N	\N	SI	Privada	MARTHA JANNETH SOSA ARAUJO	2025-10-06 14:53:54.948-05	2025-10-06 14:53:54.948-05	PASTO	1
189	Nariño	5200102735	INSTITUTO NEUROCIENCIAS DE NARIÑO IPS SAS	901164565	INSTITUTO NEUROCIENCIAS DE NARIÑO IPS SAS	\N	CALLE 14 NUMERO 33-15 BARRIO SAN IGNACIO	6027238141-3142483379	\N	neurocienciasnarino@gmail.com	\N	\N	SI	Privada	MARIA ANTONIETA LEON RONQUILLO	2025-10-06 14:53:54.951-05	2025-10-06 14:53:54.951-05	PASTO	1
190	Nariño	5200102490	Instituto para trastorno de la conducta INTRACOND	901001711	INSTITUTO PARA TRASTORNO DE LA CONDUCTA SAS	\N	CARRERA 35#19-65 BARRIO VERSALLES	3217014416 - 3187679488	\N	intracondtea@gmail.com	\N	\N	SI	Privada	PATRICIA ALVAREZ BUITRAGO	2025-10-06 14:53:54.953-05	2025-10-06 14:53:54.953-05	PASTO	1
191	Nariño	5200100335	INSTITUTO RADIOLOGICO DEL SUR SAS	814004822	INSTITUTO RADIOLOGICO DEL SUR SAS	NO	KR 38 # 18-123	318 824 43 34	\N	irs.pasto.contabilidad@gmail.com	\N	\N	SI	Privada	ANA JANETH ROA LEON	2025-10-06 14:53:54.955-05	2025-10-06 14:53:54.955-05	PASTO	1
192	Nariño	5200103669	INTEGRAL I.P.S. SAS	900273921	INTEGRAL I.P.S. SAS	\N	CRR 42 No. 18A-56 TORRE MEDICA VALLE DE ATRIZ PISO 5 CONSULTORIO 505 VALLE DE ATRIZ	3235089962	\N	calidad@integralips.com.co	\N	\N	SI	Privada	KEVIN FELIPE TORRES LOPEZ	2025-10-06 14:53:54.957-05	2025-10-06 14:53:54.957-05	PASTO	1
193	Nariño	5200102227	INTEGRAL SOLUTIONS SD SAS	900348830	INTEGRAL SOLUTIONS SD SAS	\N	CARRERA 33 N° 20-27 EDIFICIO V1501 CONSULTORIO 802	3137920359-3153652436-3173662935	\N	gdiaz@integralsolutionssd.com	\N	\N	SI	Privada	GINA ALEJANDRA DIAZ MOSQUERA	2025-10-06 14:53:54.96-05	2025-10-06 14:53:54.96-05	PASTO	1
194	Nariño	5200102226	INVERSIONES EN RECREACION DEPORTE Y SALUD S.A. Sigla: BODYTECH S.A.	830033206	INVERSIONES EN RECREACION DEPORTE Y SALUD S.A. Sigla: BODYTECH S.A.	\N	CRA 22 B# 2 -57 AVENIDA PANEMERICANA	3102496497	no tiene	constanza.fonseca@bodytechcorp.com	\N	\N	SI	Privada	NICOLAS MAURICIO LOAIZA GALEANO	2025-10-06 14:53:54.962-05	2025-10-06 14:53:54.962-05	PASTO	1
195	Nariño	5200103505	IPS ASISMED NARIÑO SAS	901615463	IPS ASISMED NARIÑO SAS	\N	Mz D C 8 Barrio San Ezequiel Moreno	3177809735	\N	asismednarino@gmail.com	\N	\N	SI	Privada	JONNATHAN CAMILO ZAMBRANO SANTACRUZ	2025-10-06 14:53:54.965-05	2025-10-06 14:53:54.965-05	PASTO	1
196	Nariño	5200102691	ips bienestar laboral sas	901131702	ips bienestar laboral sas	\N	calle 21 numero 30-23 Barrio Las Cuadras	3004910097	\N	ipsbienestar19@gmail.com	\N	\N	SI	Privada	MAYRA ZULENA PADILLA ESPINOZA	2025-10-06 14:53:54.967-05	2025-10-06 14:53:54.967-05	PASTO	1
197	Nariño	5200103541	IPS BIOMEDIC REHABILITACION INTEGRAL SAS	901687181	IPS BIOMEDIC REHABILITACION INTEGRAL SAS	\N	CALLE19 Nro. 30-27 LAS CUADRAS	3106274898	\N	ipsbiomedic.rehabilitacion@gmail.com	\N	\N	SI	Privada	JUDITH LORENA HURTADO SOLANO	2025-10-06 14:53:54.969-05	2025-10-06 14:53:54.969-05	PASTO	1
198	Nariño	5200103229	IPS CENTRO DE EXCELENCIA MEDICA SAS	901481124	IPS CENTRO DE EXCELENCIA MEDICA SAS	\N	Carrera 33 no. 20-27 Local 304 Edificio V1501 Avenida los Estudiantes - Riviera	3156245514	6027215888	cdemips@gmail.com	\N	\N	SI	Privada	Luis Armando Lima Zarama	2025-10-06 14:53:54.971-05	2025-10-06 14:53:54.971-05	PASTO	1
199	Nariño	5200103779	IPS CENTRO ESPECIALIZADO EN SALUD INTEGRAL Y FORMACION SAS	901836491	IPS CENTRO ESPECIALIZADO EN SALUD INTEGRAL Y FORMACION SAS	\N	Carrera 30 a No. 13-14	3160678805	\N	gerencia.ipscesi@gmail.com	\N	\N	SI	Privada	MAGDA LILIANA RUANO LASSO	2025-10-06 14:53:54.974-05	2025-10-06 14:53:54.974-05	PASTO	1
200	Nariño	5200103699	IPS CLINICA DE COLUMNA DE NARIÑO SAS	901757054	IPS CLINICA DE COLUMNA DE NARIÑO SAS	\N	Calle 7 22D-26 PISO 1 BARRIO OBRERO	3113562247	\N	juancarloseraso1004@hotmail.com	\N	\N	SI	Privada	Juan Carlos Eraso Guengue	2025-10-06 14:53:54.976-05	2025-10-06 14:53:54.976-05	PASTO	1
201	Nariño	5200103627	IPS CLINI-HEM SAS	901718404	IPS CLINI-HEM SAS	\N	CARRERA 38 No 18-69	3218480829	\N	ipsclinihem@gmail.com	\N	\N	SI	Privada	JAIRO ANDRES HERNANDEZ GUACA	2025-10-06 14:53:54.978-05	2025-10-06 14:53:54.978-05	PASTO	1
202	Nariño	5200101809	IPS DOMICILIARIA S.A.S.	900278648	IPS DOMICILIARIA S.A.S.	\N	CARRERA 38 N° 18 90	3013434354	7314029	ipsdomiciliaria@hotmail.com	\N	\N	SI	Privada	ENMA DEL SOCORRO GUERRA NIETO	2025-10-06 14:53:54.98-05	2025-10-06 14:53:54.98-05	PASTO	1
203	Nariño	5200102458	IPS DOMICILIARIA SAN RAFAEL SAS	900998315	IPS DOMICILIARIA SAN RAFAEL S.A.S	\N	CARRERA 32 B NO 19-26 VERSALLES	3128371217	\N	ipsmedicalplus@gmail.com	\N	\N	SI	Privada	JAIME ANDRES ROSERO MONTEZUMA	2025-10-06 14:53:54.983-05	2025-10-06 14:53:54.983-05	PASTO	1
204	Nariño	5200103508	IPS GENHOSPI S.A.S	900331412	IPS GENHOSPI S.A.S	\N	CALLE 18 NUMERO 42A - 75	3156247365	\N	calidadipsgenhospi@gmail.com	\N	\N	SI	Privada	MARIO FERNANDO ESPAÑA RODRIGUEZ	2025-10-06 14:53:54.985-05	2025-10-06 14:53:54.985-05	PASTO	1
205	Nariño	5200103698	IPS GLOBAL SALUD ACOSTA S.A.S	901454870	IPS GLOBAL SALUD ACOSTA S.A.S	\N	CL 18 N 36-24 EDIFICIO ASTURIAS 1 PISO LOCAL 2	3136574938	\N	gerenciaglobalsalud1@gmail.com	\N	\N	SI	Privada	CHRISTIAN DAVID ACOSTA GUERRERO	2025-10-06 14:53:54.987-05	2025-10-06 14:53:54.987-05	PASTO	1
206	Nariño	5200101517	IPS KINESIS SAS	900197094	IPS KINESIS SAS	NO	CALLE 22 No. 9 - 86 PARQUE BOLIVAR	7218522	7204282	clarahidalgo@ipskinesis.com	\N	\N	SI	Privada	CLARA ISABEL HIDALGO BRAVO	2025-10-06 14:53:54.989-05	2025-10-06 14:53:54.989-05	PASTO	1
207	Nariño	5200102438	IPS MEDICALFISIO SAS	900987119	IPS MEDICALFISIO SAS	\N	CALLE 3 No. 22E Bis - 69 Barrio:CAPUSIGRA	3008478436	\N	ipsmedicalfisio@gmail.com	\N	\N	SI	Privada	JULIANA ANDREA BENAVIDES SALAZAR	2025-10-06 14:53:54.992-05	2025-10-06 14:53:54.992-05	PASTO	1
208	Nariño	5200103595	IPS NEUROMEDICAL SIN DOLOR SAS	901721794	IPS NEUROMEDICAL SIN DOLOR SAS	\N	Cra 25 No. 16-37 CONSULTORIO 410 CENTRO MEDICO LA CASONA	3184421788	\N	neuromedicalsindolor@gmail.com	\N	\N	SI	Privada	SILVIA ALEJANDRA PABON MONCAYO	2025-10-06 14:53:54.994-05	2025-10-06 14:53:54.994-05	PASTO	1
209	Nariño	5200103086	IPS OCUPSALUD SST SAS	901390540	IPS OCUPSALUD SST SAS	\N	CRA 38 No 20-37 BARRIO MORASURCO	3146112620	7210094	ocupsaludpasto@gmail.com	\N	\N	SI	Privada	OSCAR ANDRES BASTIDAS BOLAÑOS	2025-10-06 14:53:54.995-05	2025-10-06 14:53:54.995-05	PASTO	1
210	Nariño	5200103206	IPS OSTEOSALUD NARIÑO	901076575	IPS OSTEOSALUD DEL CAUCA SAS	\N	Carrera 42A NUMERO 15 - 63 SAN JUAN DE DIOS	3003654638	\N	calidadosteosaludnarino@gmail.com	\N	\N	SI	Privada	EDITH ADRIANA BOLAÑOS ROSERO	2025-10-06 14:53:54.998-05	2025-10-06 14:53:54.998-05	PASTO	1
211	Nariño	5200102297	IPS PASTO ESPECIALIDADES SAS	900836236	IPS PASTO ESPECIALIDADES SAS	\N	CARRERA 42 NO 18 - 94 PISO 5 CENTRO EMPRESARIAL VALLE DE ATRIZ	3148501401 - 3218202399 - 7377049	7377049	IPSPASTOESPECIALIDADES@GMAIL.COM	\N	\N	SI	Privada	ANDRES DARIO CAICEDO TORO	2025-10-06 14:53:55-05	2025-10-06 14:53:55-05	PASTO	1
212	Nariño	5200102042	IPS PROTEGEMOS SALUD Y BIENESTAR SAS	900589666	IPS PROTEGEMOS SALUD Y BIENESTAR SAS	\N	cra 35 a No.20-10	7317085	\N	calidadipsprotegemos@gmail.com	\N	\N	SI	Privada	JUAN FRANCISCO HERNANDEZ HERRERA	2025-10-06 14:53:55.002-05	2025-10-06 14:53:55.002-05	PASTO	1
213	Nariño	5200102112	ips san miguel sas	900661857	ips san miguel sas	\N	CARRERA 31 # 20-13	3108905638	0	gerenciaipssanmiguel@gmail.com	\N	\N	SI	Privada	ANGIE JULIETA FIGUEROA CHAVEZ	2025-10-06 14:53:55.004-05	2025-10-06 14:53:55.004-05	PASTO	1
214	Nariño	5200103252	IPS SERVICLINICA DE NARIÑO S.A.S	901469788	IPS SERVICLINICA DE NARIÑO SAS	\N	CARRERA 28 NO. 19-39 LOCAL 2 B/LAS CUADRAS	3164830843	\N	ipsserviclinica@gmail.com	\N	\N	SI	Privada	LILIANA JARAMILLO CHAVEZ	2025-10-06 14:53:55.007-05	2025-10-06 14:53:55.007-05	PASTO	1
215	Nariño	5200103861	IPS UROANDES-UNIDAD UROLOGICA ESPEIALIZADA SAS	901834957	IPS UROANDES-UNIDAD UROLOGICA ESPEIALIZADA SAS	\N	CENTRO COMERCIAL VALLE DE ATRIZ LOCAL 232	3187337069	\N	UROANDESIPS@GMAIL.COM	\N	\N	SI	Privada	MARIO FERNANDO ERASO ALAVA	2025-10-06 14:53:55.009-05	2025-10-06 14:53:55.009-05	PASTO	1
216	Nariño	5200102045	IPSSANFELIPE	900544001	IPSSANFELIPE	\N	Carrera 25 # 22 85	7214514	\N	ambulancia.sanfelipe@gmail.com	\N	\N	SI	Privada	LUIS ALBERTO MONGE MUÑOZ	2025-10-06 14:53:55.011-05	2025-10-06 14:53:55.011-05	PASTO	1
217	Nariño	5200102359	ISIS CENTRO DE REHABILITACION LABORAL E INTEGRAL IPS S.A.S	900906622	ISIS CENTRO DE REHABILITACION LABORAL E INTEGRAL IPS SAS	\N	CARRERA 31 C No 18-44 LAS CUADRAS	3136013774	\N	isisgerenciade@gmail.com	\N	\N	SI	Privada	RUTH MARIELA VILLOTA MERINO	2025-10-06 14:53:55.012-05	2025-10-06 14:53:55.012-05	PASTO	1
218	Nariño	5200103569	KINESIOLOGÍA Y MEDICINA INTEGRAL CALIFICADA SAS	901701448	KINESIOLOGÍA Y MEDICINA INTEGRAL CALIFICADA SAS	\N	CRA 42 N 18 A 56	3127578281	\N	ips.kimedic@gmail.com	\N	\N	SI	Privada	ELIANA PATRICIA BASTIDAS CAIPE	2025-10-06 14:53:55.014-05	2025-10-06 14:53:55.014-05	PASTO	1
219	Nariño	5200102093	KUMARA SEGURIDAD Y SALUD EN EL TRABAJO - SAS	900594034	KUMARA SEGURIDAD Y SALUD EN EL TRABAJO - SAS	\N	Cra 28 Nº 17 - 39 CENTRO - EDIFICIO TABAREC 5° PISO	7364456 - 7228867 - 3176422823 - 3152357058	7228867	gerencia@kumarasst.com	\N	\N	SI	Privada	MÓNICA ISABEL ERASO BRAVO	2025-10-06 14:53:55.018-05	2025-10-06 14:53:55.018-05	PASTO	1
220	Nariño	5200100333	LABORATORIO CLINICO COMPAC SAS	814000412	LABORATORIO CLINICO COMPAC SAS	NO	Calle 12 # 35-38 BARRIO LA AURORA EDF COOMEVA PISO 3	7295651-7229348	7295651	gerenciacompacsas@gmail.com	\N	\N	SI	Privada	ZOILA DEL CARMEN ORTEGA MANTILLA	2025-10-06 14:53:55.02-05	2025-10-06 14:53:55.02-05	PASTO	1
221	Nariño	5200100752	LABORATORIO CLINICO ESPECIALIZADO LIMITADA	891224312	LABORATORIO CLINICO ESPECIALIZADO LIMITADA	NO	Carrera 28 # 17 - 39	7290452	7222487	gerenciaespecializado@gmail.com	\N	\N	SI	Privada	SARA RAQUEL RECALDE MORILLO	2025-10-06 14:53:55.023-05	2025-10-06 14:53:55.023-05	PASTO	1
222	Nariño	5200100935	LABORATORIO CLINICO ESPECIALIZADO UNIBAC S.A.S.	814006887	LABORATORIO CLINICO ESPECIALIZADO UNIBAC S.A.S.	\N	Calle 18 No. 30-72 Segundo Piso	7315901-7316504	7315901	labunibacsas8@gmail.com	\N	\N	SI	Privada	FERNANDO POLIVIO REINA ORTIZ	2025-10-06 14:53:55.025-05	2025-10-06 14:53:55.025-05	PASTO	1
223	Nariño	5200101928	LABORATORIO CLINICO Y DE ESPECIALIDADES SAS	900481131	LABORATORIO CLINICO Y DE ESPECIALIDADES SAS	\N	carrera 34 N 11 A 12 BARRIO AURORA	7382043	\N	gerencia@medgrouplab.com	\N	\N	SI	Privada	JAVIER JESUS PAZ MORA	2025-10-06 14:53:55.027-05	2025-10-06 14:53:55.027-05	PASTO	1
224	Nariño	5200101805	Laboratorio de Especialidades CLINIZAD S.A.S	900360269	Laboratorio de Especialidades CLINIZAD S.A.S	\N	Calle 12A No. 32-82 San Ignacio	7244387	7244387	direccionadmincalidad@clinizad.com	\N	\N	SI	Privada	GRACIELA DEL SOCORRO ZAMUDIO DAVID	2025-10-06 14:53:55.029-05	2025-10-06 14:53:55.029-05	PASTO	1
225	Nariño	5200101737	laboratorio hormonal de nariño	900334303	laboratorio hormonal de nariño	\N	CARRERA 36 NO. 19-94	7310204	7310204	gerencia@hormolab.co	\N	\N	SI	Privada	MARIA CONSUELO CASTRO CORDOBA	2025-10-06 14:53:55.031-05	2025-10-06 14:53:55.031-05	PASTO	1
226	Nariño	5200102300	LABORATORIOS DEL VALLE S.A.S	900844119	LABORATORIOS DEL VALLE S.A.S	\N	Calle 21 No 30-29	7364677 7364851	3154057280	labovalle@hotmail.com	\N	\N	SI	Privada	RAFAEL VICENTE SANTANDER OCAÑA	2025-10-06 14:53:55.034-05	2025-10-06 14:53:55.034-05	PASTO	1
227	Nariño	5200102471	LAFAM OPTICAS	900407148	LAFAM S.A.S	\N	Centro comercial Unicentro Lc 217	3182404783	\N	Nury.Herrera@co.luxottica.com	\N	\N	SI	Privada	Andres Julian Barbosa Reina	2025-10-06 14:53:55.035-05	2025-10-06 14:53:55.035-05	PASTO	1
228	Nariño	5200100981	LIGA CONTRA EL CANCER SECCIONAL NARIÑO	891201082	LIGA CONTRA EL CANCER SECCIONAL NARIÑO	NO	CALLE 8 o.32 -20 La Aurora	7227755	7234729	ligacancerpasto@gmail.com	\N	\N	SI	Privada	MARIA BETTY MONTENEGRO DE LOS RIOS	2025-10-06 14:53:55.037-05	2025-10-06 14:53:55.037-05	PASTO	1
229	Nariño	5200102382	LUXOTTICA OF COLOMBIA S.A.S	900108281	LUXOTTICA OF COLOMBIA S.A.S	\N	CALLE 22 NO 6-61	3182404783	\N	nury.herrera@co.luxottica.com	\N	\N	SI	Privada	JOSE FERNANDO CANO DIAZ	2025-10-06 14:53:55.039-05	2025-10-06 14:53:55.039-05	PASTO	1
230	Nariño	5200102459	LUZ MEDICA IPS S.A.S	900972966	LUZ MEDICA IPS S.A.S	\N	CRA 35 N 18 10 BARRIO PALERMO	(602)7364731 CEL. 3104681337-3184136077	7364731	luzmedicapasto@gmail.com	\N	\N	SI	Privada	LUCY RUBIELA BENAVIDES TELLO	2025-10-06 14:53:55.042-05	2025-10-06 14:53:55.042-05	PASTO	1
231	Nariño	5200101597	MEDFAM S.A.S.	900243869	MEDFAM S.A.S.	NO	CALLE 12 No. 32 - 58	7361166	3136306245	gerenciageneralmedfam@gmail.com	\N	\N	SI	Privada	JUAN DIEGO CASABON RODRIGUEZ	2025-10-06 14:53:55.045-05	2025-10-06 14:53:55.045-05	PASTO	1
232	Nariño	5200103651	MEDICAL P-DROZ FLORENCIA S.A.S.	900239302	MEDICAL P-DROZ FLORENCIA S.A.S.	\N	Carrera 34 A N° 14 - 59 Segundo Piso	3168880331	\N	medicalpdroz@gmail.com	\N	\N	SI	Privada	YULY KARINA BELLO HOME	2025-10-06 14:53:55.046-05	2025-10-06 14:53:55.046-05	PASTO	1
233	Nariño	5200103670	MEDICALPRO CENTER SAS	901757482	MEDICALPRO CENTER SAS	\N	Cra 42-21-20 MORASURCO	3026911919	\N	medicalprocenterips@gmail.com	\N	\N	SI	Privada	ANA CRISTINA ESTRADA ORTIZ	2025-10-06 14:53:55.049-05	2025-10-06 14:53:55.049-05	PASTO	1
234	Nariño	5200102835	MEDICUC IPS PASTO	900204617	MEDICUC IPS LTDA	\N	Carrera 42 N. 18A - 94 Local 119-120	3003032359 / 3188833701	\N	coordinadornacionalcalidad@gmail.com	\N	\N	SI	Privada	FABIO RENE RINCON NAVARRO	2025-10-06 14:53:55.052-05	2025-10-06 14:53:55.052-05	PASTO	1
235	Nariño	5200102314	MEDIFORT IPS	900298822	MEDIFORT IPS	\N	Calle 13 numero 30 A 61 2º Piso San Ignacio	7231989	\N	medifortips@hotmail.com	\N	\N	SI	Privada	Jacobo López Fuertes	2025-10-06 14:53:55.053-05	2025-10-06 14:53:55.053-05	PASTO	1
236	Nariño	5200100068	MEDINUCLEAR SOCIEDAD POR ACCIONES SIMPLIFICADA MEDINUCLEAR S.A.S.	800223618	MEDINUCLEAR SOCIEDAD POR ACCIONES SIMPLIFICADA MEDINUCLEAR S.A.S.	NO	Carrera 34 No. 11 A 12 Barrio Aurora piso 0,1,5	7374145	7374145	gerencia@grupomedinuclear.com	\N	\N	SI	Privada	JAVIER JESUS PAZ MORA	2025-10-06 14:53:55.054-05	2025-10-06 14:53:55.054-05	PASTO	1
237	Nariño	5200103304	MI IPS FAMILIA GROUP SAS	901495123	MI IPS FAMILIA GROUP SAS	\N	Cra 42 No. 18 A - 94 LOCAL 137 VALLE DE ATRIZ	3185735526	\N	mipsfamiliagropu@gmail.com	\N	\N	SI	Privada	SEGUNDO PRIMITIVO ENRIQUEZ ENRIQUEZ	2025-10-06 14:53:55.056-05	2025-10-06 14:53:55.056-05	PASTO	1
238	Nariño	5200102576	MONTIDENT CLINICA ODONTOLOGICA ESPECIALIZADA IPS SAS	901077407	MONTIDENT CLINICA ODONTOLOGICA ESPECIALIZADA IPS SAS	\N	CALLE 17 Nº 29-84	3176445230	\N	montidentips@outlook.com	\N	\N	SI	Privada	PAULA ANDREA MONTILLA GAMBOA	2025-10-06 14:53:55.057-05	2025-10-06 14:53:55.057-05	PASTO	1
239	Nariño	5200103765	Mundigafas G&D IPS	901768743	Mundigafas G&D IPS	\N	CR 23 NO. 16-8 LC 1 - Centro	3104023962	\N	afiliacionesqualex@gmail.com	\N	\N	SI	Privada	Kevin Andres Alzate Gomez	2025-10-06 14:53:55.059-05	2025-10-06 14:53:55.059-05	PASTO	1
240	Nariño	5200102381	NACER CEFERT SAS	900914719	NACER CEFERT SAS	\N	CRA 42 No 18A-94 CENTRO COMERCIAL VALLE DE ATRIZ LOCAL 254	3182998718	\N	consultorionacer.gr@gmail.com	\N	\N	SI	Privada	MIRYAM ESPERANZA GUERRERO GUERRERO	2025-10-06 14:53:55.06-05	2025-10-06 14:53:55.06-05	PASTO	1
241	Nariño	5200100948	NEFRODIAL SAS	814007107	NEFRODIAL SAS	\N	CALLE 14 No. 34-24	7370411 - 3154535946	\N	calidadnefrodial@gmail.com	\N	\N	SI	Privada	ANGELA MARIA SAÑUDO LOZANO	2025-10-06 14:53:55.063-05	2025-10-06 14:53:55.063-05	PASTO	1
242	Nariño	5200103416	NEFROUROS MOM SAS SEDE PASTO	900123612	nefrouros MOM SAS	\N	CARRERA 40 A No. 19 B -15 LC 609-610-612 TO PRAGA	3228493487	\N	gerenciaoperativazona4@nefrouros.net	\N	\N	SI	Privada	ANGELICA MARIA PERDOMO ALVAREZ	2025-10-06 14:53:55.065-05	2025-10-06 14:53:55.065-05	PASTO	1
243	Nariño	5200103036	OBSTETRICIA & GINECOLOGIA S.A.S. PERO PODRA UTILIZAR LA SIGLA O&G S.A.S.	830507291	OBSTETRICIA & GINECOLOGIA S.A.S. PERO PODRA UTILIZAR LA SIGLA O&G S.A.S.	\N	Carrera 42 N° 18A - 94 Local 145	7430150	\N	calidad@oyg.com.co	\N	\N	SI	Privada	PEDRO ANTONIO BARRERA CARRILLO	2025-10-06 14:53:55.067-05	2025-10-06 14:53:55.067-05	PASTO	1
244	Nariño	5200101329	OPTICA COLOMBIANA S.A.S	860001449	OPTICA COLOMBIANA S.A.S	\N	CARRERA 22B - 2 - 57	7294928	7294905	contab@opticacolombiana.com	\N	\N	SI	Privada	Maria Alejandra Cuervo Mosquera	2025-10-06 14:53:55.069-05	2025-10-06 14:53:55.069-05	PASTO	1
245	Nariño	5200102943	Optica Colsanitas SAS	800185773	OPTICA COLSANITAS SAS	\N	Calle 12 # 32 - 58	7364683	\N	calidadoptica@colsanitas.com	\N	\N	SI	Privada	FRANCK HARB HARB	2025-10-06 14:53:55.071-05	2025-10-06 14:53:55.071-05	PASTO	1
246	Nariño	5200102046	ORTHOPLAN TODAVIA CON LOS DIENTES TORCIDOS CALI SAS	900242909	ORTHOPLAN TODAVIA CON LOS DIENTES TORCIDOS PEREIRA SAS	\N	CALLE 13 # 23C-57	3206199816	\N	auditorinterno@orthoplan.com.co	\N	\N	SI	Privada	LEONEL HERNAN VARGAS VASQUEZ	2025-10-06 14:53:55.073-05	2025-10-06 14:53:55.073-05	PASTO	1
247	Nariño	5200103674	OXY I.P.S. CENTRO ESPECIALIZADO DE MEDICINA HIPERBARICA Y REHABILITACION SAS	901731721	OXY I.P.S. CENTRO ESPECIALIZADO DE MEDICINA HIPERBARICA Y REHABILITACION SAS	\N	CL 12 25 74 ED VITASANA BRR SAN FELIPE	315 8717921	\N	oxyips.medicinahiperbarica@gmail.com	\N	\N	SI	Privada	Luis Carlos Vacca Eraso	2025-10-06 14:53:55.075-05	2025-10-06 14:53:55.075-05	PASTO	1
248	Nariño	5200100020	PALERMO IMAGEN SAS	900011436	PALERMO IMAGEN SAS	NO	CRA 40 No. 16D - 115	7370645 - 3046113482	\N	administracion@palermoimagen.com	\N	\N	SI	Privada	LIDIA MARITZA ORTIZ BERMUDEZ	2025-10-06 14:53:55.078-05	2025-10-06 14:53:55.078-05	PASTO	1
249	Nariño	5200103021	PASTO SINDOLOR SAS	901305329	PASTO SINDOLOR SAS	\N	Calle 20 # 31B-40 oficina 201 Edificio Ofice center Barrio las cuadras	3105426842	\N	sindolor.pasto@gmail.com	\N	\N	SI	Privada	Iván David Maya Rodríguez	2025-10-06 14:53:55.081-05	2025-10-06 14:53:55.081-05	PASTO	1
250	Nariño	5200100143	PATOLOGOS ASOCIADOS SAS	814000049	PATOLOGOS ASOCIADOS SAS	NO	CALLE 12A N. 32-64 BARRIO SAN IGNACIO	7208581 3117708134	7208581	gerencia@patologosasociados.com.co	\N	\N	SI	Privada	SILVIO ALEXANDER PORTILLA ROSALES	2025-10-06 14:53:55.084-05	2025-10-06 14:53:55.084-05	PASTO	1
251	Nariño	5200100669	PROFESIONALES DE LA SALUD S.A. "PROINSALUD S.A."	800176807	PROFESIONALES DE LA SALUD S.A. "PROINSALUD S.A."	NO	CL 14 # 34-24	7336200	7336200	proinsaludips@proinsalud.co	\N	\N	SI	Privada	BERNARDO OCAMPO MARTINEZ	2025-10-06 14:53:55.086-05	2025-10-06 14:53:55.086-05	PASTO	1
252	Nariño	5200102168	PROVEEDORA DE VACUNAS S.A.S	900720236	PROVEEDORA DE VACUNAS S.A.S	\N	CALLE 19 No 35-30	7290055	7226922	provivacunas@yahoo.com.co	\N	\N	SI	Privada	DARIO FRANCISCO ENRIQUEZ MARTINEZ	2025-10-06 14:53:55.088-05	2025-10-06 14:53:55.088-05	PASTO	1
253	Nariño	5200100145	REHABILITACION DIRIGIDA MEDICAMENTE REDIME LTDA.	814000839	REHABILITACION DIRIGIDA MEDICAMENTE REDIME LTDA.	NO	CARRERA 33 # 12 A - 44 CLINICA SAN IGNACIO 4 piso Consultorio 409	3003002082	\N	redimeahora@yahoo.es	\N	\N	SI	Privada	LUIS ENRIQUE DELGADO ESCOBAR	2025-10-06 14:53:55.09-05	2025-10-06 14:53:55.09-05	PASTO	1
254	Nariño	5200100220	RTS S.A.S	805011262	RTS S.A.S	NO	Calle 12# 35-38 PISO 2 Y PISO 4 - Barrio:La Aurora	602-7380744 - 3175015655	\N	maria.cardenas@vantive.com	\N	\N	SI	Privada	LUIS ALBERTO DELGADO RAMOS	2025-10-06 14:53:55.092-05	2025-10-06 14:53:55.092-05	PASTO	1
255	Nariño	5200102191	RX Seno Diagnóstico S.A.S.	900626481	RX Seno Diagnóstico S.A.S.	\N	Cra. 33A No 19-64 EDIFICIO MURANO SAN ANTONIO	3135589201 - 3135514864 - 3206942842	\N	senodiagnostico2014@gmail.com	\N	\N	SI	Privada	LUIS FERNANDO CAICEDO BASTIDAS	2025-10-06 14:53:55.095-05	2025-10-06 14:53:55.095-05	PASTO	1
256	Nariño	5200102922	SALUD IPS SAN RAFAEL ARCANGEL S.A.S	901277888	SALUD IPS SAN RAFAEL ARCANGEL S.A.S	\N	CALLE 15 N° 41-41	3182229010	3182229010	ipssanrafaelarcangelsas@gmail.com	\N	\N	SI	Privada	DURBY YANETH DIAZ HENAO	2025-10-06 14:53:55.097-05	2025-10-06 14:53:55.097-05	PASTO	1
257	Nariño	5200103559	SALUD ÍNTEGRA IPS S.A.S	900922290	Salud Integra IPS	\N	Carrera 42 No. 18 A 94 Local 14	3128045175	\N	saludintegraipssas1@gmail.com	\N	\N	SI	Privada	ZULMA JASLEYDI JAUREGUI VELANDIA	2025-10-06 14:53:55.098-05	2025-10-06 14:53:55.098-05	PASTO	1
258	Nariño	5200102623	SALUD LABORAL INTEGRAL DEL SUR SAS	901090744	SALUD LABORAL INTEGRAL DEL SUR SAS	\N	CARRERA 25#16-37 CONSULTORIO 307 BARRIO CENTRO	7364948 - 3183967809	\N	salaipasto@gmail.com	\N	\N	SI	Privada	LUZ DARY CEBALLOS VALENCIA	2025-10-06 14:53:55.1-05	2025-10-06 14:53:55.1-05	PASTO	1
259	Nariño	5200102427	Salud Ocupacional de Nariño SONAR SAS	900849614	Salud Ocupacional de Nariño SONAR SAS	\N	Calle 17 No. 29-12 Centro	3133953678	7310076	sonar.gerencia@gmail.com	\N	\N	SI	Privada	HUGO EFRAIN LASSO MEDINA	2025-10-06 14:53:55.103-05	2025-10-06 14:53:55.103-05	PASTO	1
260	Nariño	5200103898	SALUD VIAL IPS PASTO SAS	901895821	SALUD VIAL IPS PASTO SAS	\N	CR 19 18 47	3213422133	\N	saludvialpasto@gmail.com	\N	\N	SI	Privada	SERGIO MARINO NARVAEZ CABRERA	2025-10-06 14:53:55.105-05	2025-10-06 14:53:55.105-05	PASTO	1
261	Nariño	5200101825	SALUD VIDA IPS S.A.S.	900410267	SALUD VIDA IPS S.A.S.	\N	CALLE 19 No. 14 A 05	7362254	\N	ipssaludvida@hotmail.com	\N	\N	SI	Privada	OSCAR FERNANDO GAVIRIA HUERTAS	2025-10-06 14:53:55.108-05	2025-10-06 14:53:55.108-05	PASTO	1
262	Nariño	5200103814	SANAR JUNTOS CLINICA DE HERIDAS IPS SAS	901854638	SANAR JUNTOS CLINICA DE HERIDAS IPS SAS	\N	CALLE10 No. 32A-63 LA AURORA	3135450796	\N	sanarjuntos.clinicadeheridas@gmail.com	\N	\N	SI	Privada	PAOLA ANDRES ORDOÑES MORCILLO	2025-10-06 14:53:55.11-05	2025-10-06 14:53:55.11-05	PASTO	1
263	Nariño	5200103035	SERVICIO INTEGRAL DE REUMATOLOGIA E INMUNOLOGIA DOCTOR ORLANDO VILLOTA PAREDES SAS	901351902	SERVICIO INTEGRAL DE REUMATOLOGIA E INMUNOLOGIA DOCTOR ORLANDO VILLOTA PAREDES SAS	\N	CRA 42 # 18A - 56 ED CLINICA LOS ANDES PISO 8	7217555-3108347225	\N	gerenciaorlandovillota@gmail.com	\N	\N	SI	Privada	JENNY JOHANNA DE LA ROSA PANTOJA	2025-10-06 14:53:55.114-05	2025-10-06 14:53:55.114-05	PASTO	1
264	Nariño	5200101781	SIES SALUD PASTO	900123436	SOCIEDAD INTEGRAL DE ESPECIALISTAS EN SALUD S.A.S Sigla SIES SALUD S.A.S	\N	KR 32 · 16A- 31/35	6027382070 3153325961-3103278789	7382070	garantia_delacalidad@sies.com.co	\N	\N	SI	Privada	Alvaro Puerto Valencia	2025-10-06 14:53:55.116-05	2025-10-06 14:53:55.116-05	PASTO	1
265	Nariño	5200102122	SM ESPECIALISTAS EN ODONTOLOGIA SAS	900609428	SM ESPECIALISTAS EN ODONTOLOGIA SAS	\N	CLL 19 No 24 - 50 Ofi 406	3182553342 - 3156052607	\N	smespecialistasodontologia@gmail.com	\N	\N	SI	Privada	MARTHA PAOLA MONTERO RIASCOS	2025-10-06 14:53:55.117-05	2025-10-06 14:53:55.117-05	PASTO	1
266	Nariño	5200101819	SOCIEDAD MEDICA SURSALUD S.A.S	900387876	SOCIEDAD MEDICA SURSALUD S.A.S	\N	CALLE 17 No. 13-56 BARRIO FATIMA	7208738 - 7370626	7208738 - EXT 116	utsursalud@hotmail.com	\N	\N	SI	Privada	ROSARIO DE FATIMA ZARAMA SANTACRUZ	2025-10-06 14:53:55.119-05	2025-10-06 14:53:55.119-05	PASTO	1
267	Nariño	5200102373	SOMEB DE NARIÑO SALUD OCUPACIONAL Y REHABILITACION INTEGRAL S.A.S	900893325	SOMEB DE NARIÑO SALUD OCUPACIONAL Y REHABILITACION INTEGRAL S.A.S	\N	CRA 36 No 18-108 Barrio Versalles	3167975254- 3150554445-3192981116-3188813875	\N	gerentesomebips@gmail.com	\N	\N	SI	Privada	MIRIAM PAZ JOJOA	2025-10-06 14:53:55.121-05	2025-10-06 14:53:55.121-05	PASTO	1
268	Nariño	5200103317	SOMOS SALUD IPS SAS	900668712	SOMOS SALUD IPS SAS	\N	CARRERA 22F NUMERO 11-12	3182873945	\N	somosaludpasto@gmail.com	\N	\N	SI	Privada	YIMMI DAVID PANTOJA CUASTUMAL	2025-10-06 14:53:55.122-05	2025-10-06 14:53:55.122-05	PASTO	1
269	Nariño	5200103111	SUR SALUD E-HEALTH SAS	901340340	SUR SALUD E-HEALTH SAS	\N	CR 35 NO 19 - 41 EDIFICIO SURSALUD P 5	3104088197	\N	armando.lima@ipssursalud.com	\N	\N	SI	Privada	DANIEL GUERRA ZARAMA	2025-10-06 14:53:55.124-05	2025-10-06 14:53:55.124-05	PASTO	1
270	Nariño	5200102185	SUR SALUD VITAL SAS	900751760	SUR SALUDVITAL SAS	\N	VEREDA DOLORES PR900 VTE CATAMBUCO	3208245370-3167003429	\N	sursaludvitalsas@gmail.com	\N	\N	SI	Privada	EDISON GUSTAVO BURGOS CHAMORRO	2025-10-06 14:53:55.127-05	2025-10-06 14:53:55.127-05	PASTO	1
271	Nariño	5200103219	SYNLAB COLOMBIA S.A.S.	800087565	SYNLAB COLOMBIA S.A.S.	\N	CARRERA 30 19A-00	6026607070 opc 7 Temas normativos	\N	claudia.dimate@synlab.co / erika.echavarria@synlab.co / andrea.mendez@SYNLAB.CO / alejandra.serna@synlab.co / mariangeles.davila@synlab.co / servicliente@synlab.co	\N	\N	SI	Privada	SANDOR TIBOR SPAKOVSZKY	2025-10-06 14:53:55.129-05	2025-10-06 14:53:55.129-05	PASTO	1
272	Nariño	5200102238	SYSO CONSULTORES SAS	900694940	SYSO CONSULTORES SAS	\N	Calle 21 # 29-94	7366846	3206516244	siau.sysoips@gmail.com	\N	\N	SI	Privada	CARLOS ALBERTO ULLOA PISSO	2025-10-06 14:53:55.13-05	2025-10-06 14:53:55.13-05	PASTO	1
273	Nariño	5200103515	TRINITAS S.A.S	901643336	TRINITAS S.A.S	\N	Carrera 33A #20-27 , Edificio V1501 consultorio 903 Avenida de Los Estudiantes	3226092205	\N	trinitascentrointernacional@gmail.com	\N	\N	SI	Privada	DAMIR ALBERTO BRAVO MOLINA	2025-10-06 14:53:55.132-05	2025-10-06 14:53:55.132-05	PASTO	1
274	Nariño	5200100891	UNIDAD CARDIOQUIRURGICA DE NARIÑO SAS	814006248	UNIDAD CARDIOQUIRURGICA DE NARIÑO SAS	NO	CARRERA 36 No. 16 B 64	7244303	7244303	gerencia@cardioquirurgica.com.co	\N	\N	SI	Privada	ELIANETH RODRIGUEZ PINEDA	2025-10-06 14:53:55.134-05	2025-10-06 14:53:55.134-05	PASTO	1
275	Nariño	5200101892	Unidad Clinica Sangabriel ltda.	900161310	Unidad Clinica Sangabriel ltda.	\N	CARRERA 38 Numero 19-41 oficina 202 Barrio Palermo	3136801850	-	clinisangabriel@yahoo.es	\N	\N	SI	Privada	Oscar Berney Murillo Lopez	2025-10-06 14:53:55.136-05	2025-10-06 14:53:55.136-05	PASTO	1
276	Nariño	5200102971	UNIDAD DE FISIATRIA Y ORTHOINTEGRAL SAS	901243673	UNIDAD DE FISIATRIA Y ORTHOINTEGRAL SAS	\N	CRA 33 No 20-27 EDIFICIO V1501 CUARTO PISO	3206942842	\N	gerencia@unidadfisiatria.com	\N	\N	SI	Privada	FERNANDO ALIRIO ENRIQUEZ TORRES	2025-10-06 14:53:55.138-05	2025-10-06 14:53:55.138-05	PASTO	1
277	Nariño	5200102914	UNIDAD DE OPTOMETRIA LOS ANGELES SAS	901241562	UNIDAD DE OPTOMETRIA LOS ANGELES SAS	\N	CALLE 18 a No. 25-37 PASAJE CORAZON DE JESUS	3226349071	\N	unidaddeoptometrialosangeles@hotmail.com	\N	\N	SI	Privada	AMANDA PATRICIA SANTACRUZ ANDRADE	2025-10-06 14:53:55.139-05	2025-10-06 14:53:55.139-05	PASTO	1
278	Nariño	5200102612	UNIDAD ESPECIALIZADA CLINILASER SAS	901072304	UNIDAD ESPECIALIZADA CLINILASER SAS	\N	CARRERA 35 NO 17 - 68 BARRIO MARIDIAZ	7314505	7314505	unidadespecializadaclinilaser@gmail.com	\N	\N	SI	Privada	JISELL MELISA MARTINEZ BURBANO	2025-10-06 14:53:55.141-05	2025-10-06 14:53:55.141-05	PASTO	1
279	Nariño	5200101513	UNIDAD MEDICA UROLOGICA DE NARIÑO S.A.S. UROLAN S.A.S.	900145238	UNIDAD MEDICA UROLOGICA DE NARIÑO S.A.S. UROLAN S.A.S.	NO	Cra. 33 A No 20 - 42 BARRIO LA RIEVIERA	3212368394 - 3162874057	\N	gerencia@urolan.com	\N	\N	SI	Privada	YUDY ALEXANDRA ERAZO SOLARTE	2025-10-06 14:53:55.144-05	2025-10-06 14:53:55.144-05	PASTO	1
280	Nariño	5200101969	UNIDAD ODONTOLOGICA BELLATRIZ SAS	900501736	UNIDAD ODONTOLOGICA BELLATRIZ SAS	\N	carrea 40 A No. 19A-71	7314400	7314400	periodoncia_rx@hotmail.com	\N	\N	SI	Privada	LIBARDO CLEMENTE VALLEJO CEBALLOS	2025-10-06 14:53:55.147-05	2025-10-06 14:53:55.147-05	PASTO	1
281	Nariño	5200102526	UNIMEDIC IPS S.A.S	901047630	UNIMEDIC IPS S.A.S	\N	CARRERA 34 No 19-79 barrio versalles	3187126105	\N	ipsunimedicsas@gmail.com	\N	\N	SI	Privada	CARLOS EDUARDO MUÑOZ RAMIREZ	2025-10-06 14:53:55.149-05	2025-10-06 14:53:55.149-05	PASTO	1
282	Nariño	5200101559	URCUNINA SALUD LTDA	900174961	URCUNINA SALUD LTDA	\N	Carrera 37 #19-B-35 Consultorio 604 Edificio Hito	3224963943	3006761926	fvmoranm@gmail.com	\N	\N	SI	Privada	FILIPO VLADIMIR MORAN MONTENEGRO	2025-10-06 14:53:55.15-05	2025-10-06 14:53:55.15-05	PASTO	1
283	Nariño	5200102448	VENAS Y PIEL - UNIDAD VASCULAR Y DERMATOLOGICA SAS	900973467	VENAS Y PIEL - UNIDAD VASCULAR Y DERMATOLOGICA SAS	\N	CALLE 20 No 42 A - 130 MORASURCO	7364751	3017752263	cxendovascularydermatologica@gmail.com	\N	\N	SI	Privada	JUAN CARLOS MUÑOZ ZAMBRANO	2025-10-06 14:53:55.152-05	2025-10-06 14:53:55.152-05	PASTO	1
284	Nariño	5200102829	VIDA EN CASA	901163399	VIDA EN CASA SAS	\N	CALLE 21 No. 22 - 63	3046834578 - 3017550305	\N	vidaencasasas@yahoo.com	\N	\N	SI	Privada	JUAN CARLOS IBARRA MARTINEZ	2025-10-06 14:53:55.153-05	2025-10-06 14:53:55.153-05	PASTO	1
285	Nariño	5200103525	VISAL RT SAS	901210787	VISAL RT S.A.S	\N	CARRERA 42 # 18A-94 LOCAL 141 CENTRO EMPRESARIAL VALLE DE ATRIZ	3117885632	\N	visalrtsas.pasto@gmail.com	\N	\N	SI	Privada	ANA MATILDE TORO ANDRADE	2025-10-06 14:53:55.155-05	2025-10-06 14:53:55.155-05	PASTO	1
286	Nariño	5200103872	VITALSYS SAS	901893125	VITALSYS SAS	\N	CR 33A 1A 56 AV. PANAMERICANA BRR EL VERGEL	3175175119	\N	vitalsyssas@gmail.com	\N	\N	SI	Privada	Jaime Alberto Arteaga Coral	2025-10-06 14:53:55.157-05	2025-10-06 14:53:55.157-05	PASTO	1
287	Nariño	5200100157	VIVIR SAS	814001933	VIVIR SAS	NO	CRA 42 # 18 A 56 PISO 6 CONS 608	3007825200	3150223238	vivirsas@gmail.com	\N	\N	SI	Privada	LIBIA JANNETH ARTURO ARISTIZABAL	2025-10-06 14:53:55.16-05	2025-10-06 14:53:55.16-05	PASTO	1
288	Nariño	5254001487	E.S.E. CENTRO DE SALUD POLICARPA	900176479	E.S.E. CENTRO DE SALUD POLICARPA	SI	PUERTO NUEVO 1ª ETAPA	3225157986	\N	informacion@esecentrodesaludpolicarpanarino.gov.co	1	\N	SI	Pública	SEBASTIAN JACOBO JIMENEZ PAZ	2025-10-06 14:53:55.162-05	2025-10-06 14:53:55.162-05	POLICARPA	4
289	Nariño	5254003560	IPS CLINICA SINERGIA SAS	901593894	IPS CLINICA SINERGIA SAS	\N	BARRIO CENTRO	3217022601	\N	ips.sinergiasas@gmail.com	\N	\N	SI	Privada	JOSE ALEXANDER GUTIERREZ LOPEZ	2025-10-06 14:53:55.164-05	2025-10-06 14:53:55.164-05	POLICARPA	1
290	Nariño	5254002813	IPS FUNDACION CRISOLES	901198827	FUNDACION CRISOLES	\N	carrera 4 a numero 2-53 barrio san francisco	3103895912	\N	jose-munoz89@hotmail.com	\N	\N	SI	Privada	JOSE RUFINO MUÑOZ BENAVIDES	2025-10-06 14:53:55.165-05	2025-10-06 14:53:55.165-05	POLICARPA	1
291	Nariño	5256000237	E.S.E CENTRO HOSPITAL LUIS ANTONIO MONTERO	814003182	E.S.E CENTRO HOSPITAL LUIS ANTONIO MONTERO	SI	BARRIO LA UNION	3108301842	\N	gerenciachlam@eseluisantoniomonteropotosi.gov.co	1	\N	SI	Pública	DIANA CRISTINA ZAMBRANO ZAMBRANO	2025-10-06 14:53:55.167-05	2025-10-06 14:53:55.167-05	POTOSÍ	4
292	Nariño	5256500972	CENTRO DE SALUD DE PROVIDENCIA E.S.E.	814007194	CENTRO DE SALUD DE PROVIDENCIA E.S.E.	SI	BETANIA	3216134115 - 3104062804 - 3104065787	N/A	gerenciaprovidenciaese@gmail.com	1	\N	SI	Pública	FRANCISCO ROSEMBER PASCUAZA BURBANO	2025-10-06 14:53:55.17-05	2025-10-06 14:53:55.17-05	PROVIDENCIA	4
293	Nariño	5257300562	CENTRO HOSPITAL NUESTRO SEÑOR DE LA DIVINA MISERICORDIA PUERRES E.S.E.	814003370	CENTRO HOSPITAL NUESTRO SEÑOR DE LA DIVINA MISERICORDIA PUERRES E.S.E.	SI	BARRIO LA CRUZ	7422187	3104276606	esepuerres1@gmail.com	1	\N	SI	Pública	OSCAR IVAN DORADO RODRIGUEZ	2025-10-06 14:53:55.172-05	2025-10-06 14:53:55.172-05	PUERRES	4
294	Nariño	5258500933	CENTRO DE SALUD SAN JUAN BAUTISTA DE PUPIALES EMPRESA SOCIAL DEL ESTADO	814006654	CENTRO DE SALUD SAN JUAN BAUTISTA DE PUPIALES EMPRESA SOCIAL DEL ESTADO	SI	Calle 3 No 2 - 48 Barrio San Francisco	3043403093 -3187168148 - 3172950346	\N	esepupiales@gmail.com	1	\N	SI	Pública	ADRIANA ELISABETH TOBAR ARCINEGAS	2025-10-06 14:53:55.176-05	2025-10-06 14:53:55.176-05	PUPIALES	4
295	Nariño	5261201394	HOSPITAL RICAURTE EMPRESA SOCIAL DEL ESTADO	900121152	HOSPITAL RICAURTE EMPRESA SOCIAL DEL ESTADO	SI	Barrio Guayabal	3173789523	3217667729	gerencia@hospitalricaurteese.gov.co	1	\N	SI	Pública	HENRY HERNAN BARCO RAMOS	2025-10-06 14:53:55.178-05	2025-10-06 14:53:55.178-05	RICAURTE	4
296	Nariño	5262101493	E.S.E. CENTRO HOSPITAL LAS MERCEDES	900160887	E.S.E. CENTRO HOSPITAL LAS MERCEDES	SI	SAN JOSE	3213770744	\N	eselasmercedesroberto@gmail.com	1	\N	SI	Pública	LUZ STELLA ORTIZ	2025-10-06 14:53:55.18-05	2025-10-06 14:53:55.18-05	ROBERTO PAYÁN	4
297	Nariño	5267803357	CENTRO DE DIAGNOSTICO ESPECIALIZADO IPS GUADALUPE SAMANIEGO SAS	901560669	CENTRO DE DIAGNOSTICO ESPECIALIZADO IPS GUADALUPE SAMANIEGO SAS	\N	CARRERA 7 CALLE 5 Nº 44	3160887930	\N	guadalupecde@gmail.com	\N	\N	SI	Privada	NOHORA MILENA MELO MELO	2025-10-06 14:53:55.183-05	2025-10-06 14:53:55.183-05	SAMANIEGO	1
298	Nariño	5267800613	ESE HOSPITAL LORENCITA VILLEGAS DE SANTOS	891200622	ESE HOSPITAL LORENCITA VILLEGAS DE SANTOS	SI	KR 6a # 6-04	3186085774	3186085774	hospital.lvs@eselorencitavillegasdesantos-narino.gov.co	1	\N	SI	Pública	LUIS FELIPE ORTEGA BENAVIDES	2025-10-06 14:53:55.185-05	2025-10-06 14:53:55.185-05	SAMANIEGO	4
299	Nariño	5267801339	LABORATORIO CLINICO ESPECIALIZADO MUESTRA MED DOS	87452925	LABORATORIO CLINICO ESPECIALIZADO MUESTRA MED DOS	\N	AVDA SHUMACKER # 6-39	3167403583	\N	laboratoriomuestramed@gmail.com	\N	\N	SI	Privada	LUIS JAVIER DIAZ RAMIREZ	2025-10-06 14:53:55.187-05	2025-10-06 14:53:55.187-05	SAMANIEGO	1
300	Nariño	5267802409	Prosanit I.P.S S.A.S	900958773	Prosanit I.P.S S.A.S	\N	Calle 3 Nº 1 - 19	3173790236	\N	prosanitips@gmail.com	\N	\N	SI	Privada	Jenny Alexandra Yela Benavides	2025-10-06 14:53:55.189-05	2025-10-06 14:53:55.189-05	SAMANIEGO	1
301	Nariño	5267802693	SAMANIEGO DE LA MANO DE DIOS IPS S.A.S	901117147	SAMANIEGO DE LA MANO DE DIOS IPS S.A.S	\N	carrera 4 N° 7-39 B/la inmaculada	3222572147 - 3222574500	\N	ipsdelamanodedios@gmail.com	\N	\N	SI	Privada	JUAN CARLOS CORTES ROMO	2025-10-06 14:53:55.191-05	2025-10-06 14:53:55.191-05	SAMANIEGO	1
302	Nariño	5268501378	ESE CENTRO DE SALUD SAN BERNARDO	900134576	ESE CENTRO DE SALUD SAN BERNARDO	SI	Barrio Fatima	3144185972	3127609280	esesanbernardo@hotmail.com	1	\N	SI	Pública	JUAN ALEJANDRO AZZA RODRIGUEZ	2025-10-06 14:53:55.193-05	2025-10-06 14:53:55.193-05	SAN BERNARDO	4
303	Nariño	5268701557	E.S.E. CENTRO DE SALUD SAN LORENZO	900192832	E.S.E. CENTRO DE SALUD SAN LORENZO	SI	Barrio Plaza Suárez	3148325556	3217785873	gerencia@esesanlorenzo-narino.gov.co	1	\N	SI	Pública	LESLIE PAMELA ACOSTA NARVAEZ	2025-10-06 14:53:55.196-05	2025-10-06 14:53:55.196-05	SAN LORENZO	4
304	Nariño	5269300351	HOSPITAL SAN CARLOS E.S.E.	891200543	HOSPITAL SAN CARLOS E.S.E.	SI	KR 4a CL 7a ESQUINA	3174395841	7285408	hospitalsancarlos@gmail.com	1	\N	SI	Pública	VIVIAN YALILA PAEZ ORDOÑEZ	2025-10-06 14:53:55.198-05	2025-10-06 14:53:55.198-05	SAN PABLO	4
305	Nariño	5269401373	E.S.E. CENTRO DE SALUD MUNICIPAL DE CARTAGO	900122524	E.S.E. CENTRO DE SALUD MUNICIPAL DE CARTAGO	SI	B/ PORVENIR	3217303688	\N	saludcartagoese@yahoo.es	1	\N	SI	Pública	KAREN DAYANA PABON GOMEZ	2025-10-06 14:53:55.201-05	2025-10-06 14:53:55.201-05	SAN PEDRO DE CARTAGO	4
306	Nariño	5268300609	ESE HOSPITAL CLARITA SANTOS DE SANDONA	891200248	ESE HOSPITAL CLARITA SANTOS DE SANDONA	SI	Calle 9No 03-39	7288101	3174410595	hclaritasantos@gmail.com	1	\N	SI	Pública	ALVARO ALEJANDRO ERAZO JATIVA	2025-10-06 14:53:55.204-05	2025-10-06 14:53:55.204-05	SANDONÁ	4
307	Nariño	5268303017	IPS ALIANZA VITAE SAS	901219861	IPS ALIANZA VITAE SAS	\N	CALLE 8 #4-29 BARRIO MELENDEZ	3117841708	\N	ipsalianzavitaesas@gmail.com	\N	\N	SI	Privada	ELIANA LIZBETH RODRIGUEZ SAAVEDRA	2025-10-06 14:53:55.207-05	2025-10-06 14:53:55.207-05	SANDONÁ	1
308	Nariño	5268303708	IPS CENTRO RADIOLOGICO SANDONA SAS	901738912	IPS CENTRO RADIOLOGICO SANDONA SAS	\N	CR 3 06 20 BRR COMERCIO	3108446720	\N	CENTRORADIOLOGICOSANDONA609@GMAIL.COM	\N	\N	SI	Privada	JOHN EDISON RUIZ BARCO	2025-10-06 14:53:55.209-05	2025-10-06 14:53:55.209-05	SANDONÁ	1
309	Nariño	5268301310	ipssanarsaludsas	900105595	ipssanarsaludsas	\N	CARRERA 5 Nº 06-08 B/ EL COMERCIO	3153782294	\N	ipssanarsaludsas@hotmail.com	\N	\N	SI	Privada	HERNEY ORLANDO JARMILLO GUERRERO	2025-10-06 14:53:55.21-05	2025-10-06 14:53:55.21-05	SANDONÁ	1
310	Nariño	5269601494	E.S.E. CENTRO DE SALUD SANTA BARBARA ISCUANDE	900109862	E.S.E. CENTRO DE SALUD SANTA BARBARA ISCUANDE	SI	PUEBLO NUEVO	7466067	3107682714	centrodesaludsantabarbara@gmail.com	1	\N	SI	Pública	VERONICA CASTRO ANGULO	2025-10-06 14:53:55.212-05	2025-10-06 14:53:55.212-05	SANTA BÁRBARA	4
311	Nariño	5269602624	GRUPO EMPRESARIAL DE LA SALUD CONSUSALUD S.A.S	901078112	GRUPO EMPRESARIAL DE LA SALUD CONSUSALUD S.A.S	\N	Barrio el Estadio Carrera 4	3148725269	\N	sanyodelao@hotmail.com	\N	\N	SI	Privada	SANDRA PATRICIA OLIVEROS ANGULO	2025-10-06 14:53:55.214-05	2025-10-06 14:53:55.214-05	SANTA BÁRBARA	1
312	Nariño	5269901368	E.S.E. CENTRO DE SALUD GUACHAVÉS	900129891	E.S.E. CENTRO DE SALUD GUACHAVÉS	SI	BARRIO OLAYA HERRERA	3113325017	\N	gerencia@eseguachavez.gov.co	1	\N	SI	Pública	JOHN DEYBER RUALES ROSALES	2025-10-06 14:53:55.217-05	2025-10-06 14:53:55.217-05	SANTACRUZ	4
313	Nariño	5269900716	IPS INDIGENA MINGASALUD RESGUARDO INDIGENA DE GUACHAVEZ	814005761	IPS INDIGENA MINGASALUD RESGUARDO INDIGENA DE GUACHAVEZ	NO	BARRIO CRISTO REY ESQUINA	3235800389	3137367509	mingasalud@hotmail.com	1	\N	SI	Pública	YULIETH ANGELY CALDERON ESTRADA	2025-10-06 14:53:55.218-05	2025-10-06 14:53:55.218-05	SANTACRUZ	4
314	Nariño	5272001059	CENTRO DE SALUD SAPUYES E.S.E.	900014225	CENTRO DE SALUD SAPUYES E.S.E.	SI	CARRERA EL ROSARIO	3136818624	\N	centrodesaludsapuyesese@gmail.com	1	\N	SI	Pública	MIRIAM PATRICIA GOYES CHAMORRO	2025-10-06 14:53:55.221-05	2025-10-06 14:53:55.221-05	SAPUYES	4
315	Nariño	5278601536	E.S.E. CENTRO HOSPITAL SAN JUAN BAUTISTA	900127211	E.S.E. CENTRO HOSPITAL SAN JUAN BAUTISTA	SI	BR SAN FRANCISCO	3182175715 - 3128701709 - 3186641291 - 3186642613	\N	bautistaese@gmail.com	1	\N	SI	Pública	LAIONEL CAMILO QUINTERO ROMERO	2025-10-06 14:53:55.222-05	2025-10-06 14:53:55.222-05	TAMINANGO	4
316	Nariño	5278803817	CENTRO DE REHABILITACION INTEGRAL FULL RECOVERY SAS	901821889	CENTRO DE REHABILITACION INTEGRAL FULL RECOVERY SAS	\N	Calle 3 No. 2-54 B/ El Carmen	3116026702	\N	crifullrecovery@gmail.com	\N	\N	SI	Privada	CRISTIAN DANIEL SANTACRUZ PRADO	2025-10-06 14:53:55.224-05	2025-10-06 14:53:55.224-05	TANGUA	1
317	Nariño	5278801372	CENTRO DE SALUD HERMES ANDRADE MEJIA ESE TANGUA	900125582	CENTRO DE SALUD HERMES ANDRADE MEJIA ESE TANGUA	SI	BRR EL CARMEN	3103524704	3103524704	gerencia@esehamtanguanarino.gov.co	1	\N	SI	Pública	DAISY NATALY VILLOTA SOLARTE	2025-10-06 14:53:55.226-05	2025-10-06 14:53:55.226-05	TANGUA	4
318	Nariño	5283500905	CENTRO HOSPITAL DIVINO NIÑO EMPRESA SOCIAL DEL ESTADO	840001036	CENTRO HOSPITAL DIVINO NIÑO EMPRESA SOCIAL DEL ESTADO	SI	Barrio Nuevo Horizonte	927271556	92727155	divinonino@esechdntumaco.gov.co	1	\N	SI	Pública	EIDIS MONICA RODRIGUEZ QUIÑONES	2025-10-06 14:53:55.228-05	2025-10-06 14:53:55.228-05	TUMACO	4
319	Nariño	5283501902	Centro Internacional de Entrenamiento e Investigaciones Medicas CIDEIM	800092879	Centro Internacional de Entrenamiento e Investigaciones Medicas CIDEIM	\N	Calle Sucre Diagonal banco popular- contiguo laboratorio clinico Rosalba Molineros	727 2424	727 2424	cideim@cideim.org.co	\N	\N	SI	Mixta	NANCY GORE SARAVIA	2025-10-06 14:53:55.23-05	2025-10-06 14:53:55.23-05	TUMACO	3
320	Nariño	5283501489	CLINICA PUENTE DEL MEDIO SAS	900180747	CLINICA PUENTE DEL MEDIO SAS	NO	Calle Popayán	7275933	\N	ipspuentedelmedio@hotmail.com	\N	\N	SI	Privada	CINDY LEUSSON CHAVEZ	2025-10-06 14:53:55.232-05	2025-10-06 14:53:55.232-05	TUMACO	1
321	Nariño	5283500546	CORSALUD TUMACO IPS SAS	840000260	CORSALUD TUMACO IPS SAS	\N	Calle Mercedes con San Carlos	7274579	3126812641	corsaludtco@gmail.com	\N	\N	SI	Privada	SULAY MARISCAL	2025-10-06 14:53:55.234-05	2025-10-06 14:53:55.234-05	TUMACO	1
322	Nariño	5283500766	COSMITET LTDA COORPORACION DE SERVICIOS MEDICOS INTERNACIONALES THEM & CIA	830023202	COSMITET LTDA CORPORACION DE SERVICIOS MEDICOS INTERNACINALES THEM Y CIA	\N	Calle Mosquera frente al parque Colón	7271525	7277631	garantiacalidad.cali.magisterio@cosmitet.net	\N	\N	SI	Privada	DIONISIO MANUEL ALANDETE HERRERA	2025-10-06 14:53:55.239-05	2025-10-06 14:53:55.239-05	TUMACO	1
323	Nariño	5283500260	HOSPITAL SAN ANDRES E.S.E.	800179870	HOSPITAL SAN ANDRES E.S.E.	SI	KILOMETRO 23 INGUAPI DEL CARMEN	3107515220	\N	gerencia@hospitalsanandresese.gov.co	2	\N	SI	Pública	MARYLIN ROSALES ARBOLEDA	2025-10-06 14:53:55.241-05	2025-10-06 14:53:55.241-05	TUMACO	4
324	Nariño	5283501049	INSTITUCION PRESTADORA DE SERVICIOS DE SALUD LOS ANGELES IPS	837000708	INSTITUCION PRESTADORA DE SERVICIOS DE SALUD LOS ANGELES IPS	\N	Av La Playa Frente al ITPC	7276332	7276332	gerenciaipiales@ipslosangeles.com.co	\N	\N	SI	Privada	SANDRA VIVIANA JURADO MORAN	2025-10-06 14:53:55.244-05	2025-10-06 14:53:55.244-05	TUMACO	1
325	Nariño	5283502685	INSTITUTO RADIOLOGICO DEL SUR OCCIDENTE TUMACO S.A.S	900186318	Instituto Radiologico del Suroccidente SAS	\N	CALLE SUCRE C-84	318 824 43 34	\N	irs.pasto.contabilidad@gmail.com	\N	\N	SI	Privada	ANA JANETH ROA LEON	2025-10-06 14:53:55.246-05	2025-10-06 14:53:55.246-05	TUMACO	1
326	Nariño	5283503257	IPS 7 DE AGOSTO SAS	901503020	IPS 7 DE AGOSTO SAS	\N	CALLE 7 DE AGOSTO 3-41	3148257595	\N	ips7deagosto7@gmail.com	\N	\N	SI	Privada	ADALBERTA SAYA DE RIVERA	2025-10-06 14:53:55.249-05	2025-10-06 14:53:55.249-05	TUMACO	1
327	Nariño	5283502143	IPS ASISTENCIA TERAPEUTICA EN CASA SAS	900691144	IPS ASISTENCIA TERAPEUTICA EN CASA SAS	\N	barrio miramar casa 9	3166200979-3183018518	\N	ipsasistenciaterapeuticaencasa@gmail.com	\N	\N	SI	Privada	EDUARDO LOPEZ VELASQUEZ	2025-10-06 14:53:55.251-05	2025-10-06 14:53:55.251-05	TUMACO	1
328	Nariño	5283502689	IPS CUIDEMOS TU SALUD S.A.S	901133472	IPS CUIDEMOS TU SALUD S.A.S	\N	Avenida Los Estudiantes C7 D5 239	3168793188 - 3184579240	3146769985	ipscuidemostusaludsastumaco@gmail.com	\N	\N	SI	Privada	RICARDO PRADO PEREIRA	2025-10-06 14:53:55.253-05	2025-10-06 14:53:55.253-05	TUMACO	1
329	Nariño	5283501593	IPS GLOBAL SALUD LTDA	900231935	IPS GLOBAL SALUD LTDA	NO	CALLE RICAURTE CARRERA 15 #11-14	7270865	7277641	ipsglobalsaludltda@gmail.com	\N	\N	SI	Privada	LINA MARCELA IBARGUEN ESPINOSA	2025-10-06 14:53:55.256-05	2025-10-06 14:53:55.256-05	TUMACO	1
330	Nariño	5283503870	IPS ISIS S.A.S	901194351	IPS ISIS S.A.S	\N	Calle 9 B 6 B 175 PN El Progreso	3214659850	\N	ipsisis2024@gmail.com	\N	\N	SI	Privada	ANA LUCIA CASTILLO CABRERA	2025-10-06 14:53:55.258-05	2025-10-06 14:53:55.258-05	TUMACO	1
331	Nariño	5283503804	IPS L.M. OCUPACIONAL S.A.S	901528559	IPS L.M. OCUPACIONAL S.A.S	\N	BRR PUENTE EL PROGRESO CASA 13 04	7274085	\N	lalo187@hotmail.com	\N	\N	SI	Privada	Laura Lorena Moncayo Ortiz	2025-10-06 14:53:55.261-05	2025-10-06 14:53:55.261-05	TUMACO	1
332	Nariño	5283503302	IPS MAJOS REHABILITAR SAS	901514037	IPS Majos Rehabilitar SAS	\N	Calle Nueva creación CS 87 DIV 1	3153427114	\N	majosrehabilitar@outlook.es	\N	\N	SI	Privada	Cinthia Yuliet Guerrero Minota	2025-10-06 14:53:55.263-05	2025-10-06 14:53:55.263-05	TUMACO	1
333	Nariño	5283503334	IPS SALUD Y VIDA PACIFICO SAS	900790008	IPS SALUD Y VIDA PACIFIC S.A.S	\N	BARRIO SIETE DE AGOSTO	3115034074	\N	ipssaludyvidapacifico@gmail.com	\N	\N	SI	Privada	JHON HEINER GARCIA CAICEDO	2025-10-06 14:53:55.265-05	2025-10-06 14:53:55.265-05	TUMACO	1
334	Nariño	5283503318	IPS SER FELIZ CON AMOR S.A.S.	901463312	IPS SER FELIZ CON AMOR S.A.S.	\N	CALLE NUEVA CREACION 230 ED VILLA SANTANA PISO 1	3154659478	3163251056	rehabilitacionserfelizips@gmail.com	\N	\N	SI	Privada	Samir Adolfo Estacio Quiñones	2025-10-06 14:53:55.267-05	2025-10-06 14:53:55.267-05	TUMACO	1
335	Nariño	5283501075	RADIOLOGOS ASOCIADOS DEL PACIFICO LIMITADA IPS	900011824	RADIOLOGOS ASOCIADOS DEL PACIFICO LIMITADA IPS	NO	CALLE ANZOATEGUI FRENTE AL HOSPITAL SAN ANDRES	7271 892	7271 103	radiologosdelpacifico@hotmail.com	\N	\N	SI	Privada	ALVARO GUSTAVO FREIRE CHINGUAL	2025-10-06 14:53:55.271-05	2025-10-06 14:53:55.271-05	TUMACO	1
336	Nariño	5283501640	REHABILITEMOS PACIFICO IPS	900247978	REHABILITEMOS PACIFICO IPS	NO	Avenida la Playa con Calle Mosquera frente a la Urbanizacion	7276618	7276618	gerenciaipiales@ipslosangeles.com.co	\N	\N	SI	Privada	ZANDRA YAMILE IBARRA CHAMORRO	2025-10-06 14:53:55.273-05	2025-10-06 14:53:55.273-05	TUMACO	1
337	Nariño	5283503521	UNECO SAS ZOMAC	901234242	UNECO SAS ZOMAC	\N	CLL COMERCIO CS 594 DIV 1	3136626994	\N	centromedicotumaco@hotmail.com	\N	\N	SI	Privada	SHARDEY NATHALY ZAMBRANO NOGUERA	2025-10-06 14:53:55.275-05	2025-10-06 14:53:55.275-05	TUMACO	1
338	Nariño	5283502275	Unidad Pediatrica Del Sur	900812261	Unidad Pediatrica Del Sur	\N	CALLE 13 N 3 -13 CALLE POPAYAN	3173716208	\N	unidadpediatricadelsur@gmail.com	\N	\N	SI	Privada	SANDRA PATRICIA BURBANO VALLEJO	2025-10-06 14:53:55.277-05	2025-10-06 14:53:55.277-05	TUMACO	1
339	Nariño	5283501127	UNIR I.P.S S.A.S	900039796	UNIR I.P.S S.A.S	NO	CALLE ANZOATEGUI CON VILLA LOLA CASA No. 25	3136462533	3165377222	gracegallon03@hotmail.com	\N	\N	SI	Privada	GRACIELA DEL CARMEN ORTIZ GALLON	2025-10-06 14:53:55.278-05	2025-10-06 14:53:55.278-05	TUMACO	1
340	Nariño	5283803381	CENTRO DE ESPECIALIDADES DE LA SABANA IPS S.A.S	901559169	CENTRO DE ESPECIALIDADES DE LA SABANA IPS S.A.S	\N	CALLE 17 17-17	3176072744	\N	espmedicasdelasabana@gmail.com	\N	\N	SI	Privada	MARCO ADOLFO TOBAR MARCILLO	2025-10-06 14:53:55.28-05	2025-10-06 14:53:55.28-05	TÚQUERRES	1
341	Nariño	5283801857	ECCON SALUD S.A.S	900434092	ECCON SALUD SAS	\N	Calle 13 No. 15-06	7281971	3178862079	ecconsaludips@hotmail.com	\N	\N	SI	Privada	GERARDO EDMUNDO LOPEZ SANTAMARIA	2025-10-06 14:53:55.281-05	2025-10-06 14:53:55.281-05	TÚQUERRES	1
342	Nariño	5283801869	FONOCENTER SAS	900448248	FONOCENTER SAS	\N	cr. 16 # 15 La Castellana II etapa	3142330218 - 3173909408- 3014214247	\N	fonocentersas@hotmail.com	\N	\N	SI	Privada	Yody Deicy Obando Vallejos	2025-10-06 14:53:55.284-05	2025-10-06 14:53:55.284-05	TÚQUERRES	1
343	Nariño	5283802831	IPS CLINICA MARIANA TUQUERRES SAS	901180926	IPS CLINICA MARIANA TUQUERRES SAS	\N	CARRERA 17 CALLE 22-23 BARRIO SAN NICOLAS	3175713762-3160101247	\N	clinicamarianatuquerres@gmail.com	\N	\N	SI	Privada	JESUS ANDRES PORTILLA BENAVIDES	2025-10-06 14:53:55.286-05	2025-10-06 14:53:55.286-05	TÚQUERRES	1
344	Nariño	5283801782	IPS FISIOSALUD	900369494	IPS FISIOSALUD	\N	CALLE 26 No. 14-51 LA AVENIDA	7 28 09 71	3165331754	fisiosaludguerrero@yahoo.es	\N	\N	SI	Privada	JENNY PATRICIA GUERRER0 GUERRER0	2025-10-06 14:53:55.289-05	2025-10-06 14:53:55.289-05	TÚQUERRES	1
345	Nariño	5283800483	IPS INDIGENA JULIAN CARLOSAMA	814005760	IPS INDIGENA JULIAN CARLOSAMA	NO	CL 27 No 13B-70	3238186166	3238186166	ipsindigenajuliancarlosamatuq@gmail.com	1	\N	SI	Pública	ALVARO JAVIER LAGOS TOBAR	2025-10-06 14:53:55.29-05	2025-10-06 14:53:55.29-05	TÚQUERRES	4
346	Nariño	5283801927	IPS INTERFISICA SAS	900498043	IPS INTERFISICA SAS	\N	CALLE 20 No. 11-32	3177505996	\N	ipsinterfisica@hotmail.com	\N	\N	SI	Privada	CLAUDIA CONSUELO MARCILLO TOBAR	2025-10-06 14:53:55.292-05	2025-10-06 14:53:55.292-05	TÚQUERRES	1
347	Nariño	5283801302	LABORATORIO CLINICO ESPECIALIZADO MUESTRAMED	27396736	LABORATORIO CLINICO ESPECIALIZADO MUESTRAMED	NO	Cra. 14 No. 25-54 La Avenida	7281131	\N	laboratoriomuestramed@gmail.com	\N	\N	SI	Privada	CLAUDIA ANDREA CHAMORRO ROJAS	2025-10-06 14:53:55.293-05	2025-10-06 14:53:55.293-05	TÚQUERRES	1
348	Nariño	5283802535	POLICLINICO CER	901058247	POLICLINICO CER	\N	CRA 13 #23-04	7280094	\N	policlinicocer@gmail.com	\N	\N	SI	Privada	GRACIELA ENRIQUETA BRAVO URBANO	2025-10-06 14:53:55.294-05	2025-10-06 14:53:55.294-05	TÚQUERRES	1
349	Nariño	5288501383	CENTRO DE SALUDYA E.S.E DE YACUANQUER	900108282	CENTRO DE SALUDYA E.S.E DE YACUANQUER	SI	CARRERA 2 No. 9-18	3148854008	3148854008	yacuanquer@esesaludya-narino.gov.co	1	\N	SI	Pública	AURA MARIA SANCHEZ HERRERA	2025-10-06 14:53:55.296-05	2025-10-06 14:53:55.296-05	YACUANQUER	4
350	Nariño	5288501802	FUNDACION HACIA UNA NUEVA VIDA	900340536	FUNDACION HACIA UNA NUEVA VIDA	\N	CARRERA 3B - BARRIO SANTA CLARA	317 3822906 - 3182855078	\N	haciauna.nuevavida@hotmail.com	\N	\N	SI	Privada	MONICA ANDREA CAICEDO ROMERO	2025-10-06 14:53:55.299-05	2025-10-06 14:53:55.299-05	YACUANQUER	1
\.


--
-- Data for Name: procedimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procedimientos (id, id_user, tipo_doc_user, num_doc_user, data, "createdAt", "updatedAt") FROM stdin;
1	1	CC	123456	{"idMIPRES": "", "vrServicio": 30000, "codServicio": 10103, "consecutivo": 1, "codPrestador": "52000", "grupoServicios": "01", "codComplicacion": "", "numAutorizacion": "", "codProcedimiento": "010201", "tipoPagoModerador": "01", "valorPagoModerador": 30000, "fechaInicioAtencion": "2024-05-32", "numFEVPagoModerador": "", "codDiagnosticoPrincipal": "A009", "viaIngresoServicioSalud": "05", "finalidadTecnologiaSalud": "11", "codDiagnosticoRelacionado": "", "numDocumentoIdentificacion": "123456", "tipoDocumentoIdentificacion": "CD", "modalidadGrupoServicioTecSal": "01"}	2025-10-14 16:53:03.961-05	2025-10-14 16:53:03.961-05
3	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 39400, "codServicio": 706, "consecutivo": 1, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "902210", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.849-05	2025-10-23 11:07:07.849-05
4	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 18900, "codServicio": 706, "consecutivo": 2, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "903856", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.85-05	2025-10-23 11:07:07.85-05
5	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 22800, "codServicio": 706, "consecutivo": 3, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "903895", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.851-05	2025-10-23 11:07:07.851-05
6	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 25200, "codServicio": 706, "consecutivo": 4, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "907106", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.852-05	2025-10-23 11:07:07.852-05
7	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 20400, "codServicio": 706, "consecutivo": 5, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "901107", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.853-05	2025-10-23 11:07:07.853-05
8	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 80200, "codServicio": 706, "consecutivo": 6, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "906913", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.854-05	2025-10-23 11:07:07.854-05
9	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 136200, "codServicio": 706, "consecutivo": 7, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "906249", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.856-05	2025-10-23 11:07:07.856-05
10	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 25200, "codServicio": 706, "consecutivo": 8, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "906915", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.856-05	2025-10-23 11:07:07.856-05
11	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 51000, "codServicio": 706, "consecutivo": 9, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "906317", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 18:28", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.857-05	2025-10-23 11:07:07.857-05
12	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 4079200, "codServicio": 745, "consecutivo": 10, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "883440", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-07 22:32", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1087419827", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.859-05	2025-10-23 11:07:07.859-05
13	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 22800, "codServicio": 706, "consecutivo": 11, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "903895", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-10 09:50", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.862-05	2025-10-23 11:07:07.862-05
14	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 18900, "codServicio": 706, "consecutivo": 12, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "903856", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-10 09:50", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.863-05	2025-10-23 11:07:07.863-05
15	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 98200, "codServicio": 706, "consecutivo": 13, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "905410", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-10 09:50", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.864-05	2025-10-23 11:07:07.864-05
16	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 52800, "codServicio": 706, "consecutivo": 14, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "906039", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-10 18:36", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.866-05	2025-10-23 11:07:07.866-05
17	4	DE	VEN28249144	{"idMIPRES": null, "vrServicio": 192600, "codServicio": 706, "consecutivo": 15, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "906225", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-03-10 18:36", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "L039", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": "A511", "numDocumentoIdentificacion": "1085263543", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-10-23 11:07:07.867-05	2025-10-23 11:07:07.867-05
18	5	TI	1086895850	{"idMIPRES": null, "vrServicio": 1916668, "codServicio": 371, "consecutivo": 1, "codPrestador": "520010010701", "grupoServicios": "01", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": "", "codProcedimiento": "I10412", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-10-10 09:39", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "Z298", "viaIngresoServicioSalud": "02", "finalidadTecnologiaSalud": "14", "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "30723627", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2025-11-11 10:48:37.842-05	2025-11-11 10:48:37.842-05
19	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 39400, "codServicio": 706, "consecutivo": 1, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "902210", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-08-10 09:08", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2026-02-12 09:37:55.744-05	2026-02-12 09:37:55.744-05
20	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 22800, "codServicio": 706, "consecutivo": 2, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "903895", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-08-10 09:08", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2026-02-12 09:37:55.759-05	2026-02-12 09:37:55.759-05
21	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 19000, "codServicio": 706, "consecutivo": 3, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "903856", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-08-10 09:08", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2026-02-12 09:37:55.76-05	2026-02-12 09:37:55.76-05
22	7	DE	VEN26792185	{"idMIPRES": null, "vrServicio": 223500, "codServicio": 745, "consecutivo": 4, "codPrestador": "520010110201", "grupoServicios": "02", "codComplicacion": null, "conceptoRecaudo": "05", "numAutorizacion": null, "codProcedimiento": "881332", "valorPagoModerador": 0, "fechaInicioAtencion": "2025-08-10 09:08", "numFEVPagoModerador": null, "codDiagnosticoPrincipal": "N23X", "viaIngresoServicioSalud": "03", "finalidadTecnologiaSalud": "15", "codDiagnosticoRelacionado": null, "numDocumentoIdentificacion": "1085348032", "tipoDocumentoIdentificacion": "CC", "modalidadGrupoServicioTecSal": "01"}	2026-02-12 09:37:55.761-05	2026-02-12 09:37:55.761-05
\.


--
-- Data for Name: recien_nacidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recien_nacidos (id, id_user, tipo_doc_user, num_doc_user, data, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: system_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_users (id, username, password, role, created_at, updated_at, deleted_at, nombres, apellidos, cedula) FROM stdin;
2	SantiagoU	$2b$10$3a0jfBp.s0YV29M82elvyuKHz3hz2MGmNpKnsZxPm4z.5dj4TKxwG	ADMIN	2025-10-24 11:01:05.238-05	2025-10-24 11:01:05.238-05	\N	Santiago	Jojoa U	1080691332
6	admin	$2b$10$De3HYi21stbwRd5t3AI0LOMtZhhbQQwWJYrQhz.WeKWxs3XTc71yO	ADMIN	2026-02-11 15:12:52.398-05	2026-02-11 15:12:52.398-05	\N	Admin	Sistema	891280001
7	user	$2b$10$twKNag15zn95lvT.jZy3ou/se0YV0BKxVGpmVKzmOYHHaTXR4FZq.	USER	2026-02-11 15:13:44.025-05	2026-02-11 15:13:44.025-05	\N	Usuario	FevRips	8912800011
\.


--
-- Data for Name: transaccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaccion (id, id_control, num_nit, num_factura, valor_factura, tipo_nota, num_nota, fecha, "createdAt", "updatedAt") FROM stdin;
7	9	891200528	00003185981	\N			\N	2026-02-12 09:37:55.817-05	2026-02-12 09:37:55.817-05
\.


--
-- Data for Name: urgencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.urgencias (id, id_user, tipo_doc_user, num_doc_user, data, "createdAt", "updatedAt") FROM stdin;
1	4	DE	VEN28249144	{"consecutivo": 1, "fechaEgreso": "2025-03-12 14:21", "codPrestador": "520010110201", "causaMotivoAtencion": "38", "fechaInicioAtencion": "2025-03-07 17:28", "codDiagnosticoPrincipal": "L039", "codDiagnosticoPrincipalE": "L039", "codDiagnosticoCausaMuerte": null, "codDiagnosticoRelacionadoE1": "A511", "codDiagnosticoRelacionadoE2": null, "codDiagnosticoRelacionadoE3": null, "condicionDestinoUsuarioEgreso": "01"}	2025-10-23 11:07:07.871-05	2025-10-23 11:07:07.871-05
\.


--
-- Data for Name: user_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_transactions (id, id_user, id_transaction, created_at, updated_at) FROM stdin;
9	7	7	2026-02-12 09:37:55.698521-05	2026-02-12 09:37:55.698521-05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, tipo_doc, num_doc, tipo_usuario, fecha_nacimiento, cod_sexo, cod_pais_residencia, cod_municipio_residencia, incapacidad, consecutivo, cod_pais_origen, "createdAt", "updatedAt") FROM stdin;
1	CC	123456	05	2011-05-07 19:00:00-05	M	170	05197	NO	1	170	2025-10-14 16:53:03.927-05	2025-10-14 16:53:03.927-05
2	CC	1377000110	05	1993-04-13 19:00:00-05	M	170	52079	NO	1	170	2025-10-15 11:36:58.932-05	2025-10-15 11:36:58.932-05
3	CC	1379000107	05	1996-04-25 19:00:00-05	M	170	52079	NO	2	170	2025-10-15 11:36:58.97-05	2025-10-15 11:36:58.97-05
4	DE	VEN28249144	05	1995-09-11 19:00:00-05	M	862	52001	NO	1	862	2025-10-23 11:07:07.835-05	2025-10-23 11:07:07.835-05
5	TI	1086895850	04	2012-01-12 19:00:00-05	F	170	52435	NO	1	170	2025-11-11 10:48:37.817-05	2025-11-11 10:48:37.817-05
6	CC	1379000112	04	1996-04-25 19:00:00-05	M	170	52835	NO	1	170	2025-11-11 17:49:10.807-05	2025-11-11 17:49:10.807-05
7	DE	VEN26792185	11	1999-04-02 19:00:00-05	M	170	52001	NO	1	862	2026-02-12 09:37:55.702-05	2026-02-12 09:37:55.702-05
\.


--
-- Name: consultas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultas_id_seq', 23, true);


--
-- Name: control_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.control_id_seq', 9, true);


--
-- Name: hospitalizaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospitalizaciones_id_seq', 1, true);


--
-- Name: medicamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicamentos_id_seq', 46, true);


--
-- Name: otro_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otro_servicios_id_seq', 28, true);


--
-- Name: prestador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prestador_id_seq', 350, true);


--
-- Name: procedimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procedimientos_id_seq', 22, true);


--
-- Name: recien_nacidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recien_nacidos_id_seq', 1, false);


--
-- Name: system_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_users_id_seq', 7, true);


--
-- Name: transaccion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaccion_id_seq', 7, true);


--
-- Name: urgencias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.urgencias_id_seq', 1, true);


--
-- Name: user_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_transactions_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: consultas consultas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_pkey PRIMARY KEY (id);


--
-- Name: control control_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control
    ADD CONSTRAINT control_pkey PRIMARY KEY (id);


--
-- Name: hospitalizaciones hospitalizaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitalizaciones
    ADD CONSTRAINT hospitalizaciones_pkey PRIMARY KEY (id);


--
-- Name: medicamentos medicamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamentos
    ADD CONSTRAINT medicamentos_pkey PRIMARY KEY (id);


--
-- Name: otro_servicios otro_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otro_servicios
    ADD CONSTRAINT otro_servicios_pkey PRIMARY KEY (id);


--
-- Name: prestadores prestador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestadores
    ADD CONSTRAINT prestador_pkey PRIMARY KEY (id);


--
-- Name: procedimientos procedimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedimientos
    ADD CONSTRAINT procedimientos_pkey PRIMARY KEY (id);


--
-- Name: recien_nacidos recien_nacidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recien_nacidos
    ADD CONSTRAINT recien_nacidos_pkey PRIMARY KEY (id);


--
-- Name: system_users system_users_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT system_users_cedula_key UNIQUE (cedula);


--
-- Name: system_users system_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT system_users_pkey PRIMARY KEY (id);


--
-- Name: system_users system_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT system_users_username_key UNIQUE (username);


--
-- Name: transaccion transaccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT transaccion_pkey PRIMARY KEY (id);


--
-- Name: urgencias urgencias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urgencias
    ADD CONSTRAINT urgencias_pkey PRIMARY KEY (id);


--
-- Name: user_transactions user_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_transactions
    ADD CONSTRAINT user_transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_transactions_id_user_id_transaction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_transactions_id_user_id_transaction ON public.user_transactions USING btree (id_user, id_transaction);


--
-- Name: consultas consultas_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: control control_id_prestador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control
    ADD CONSTRAINT control_id_prestador_fkey FOREIGN KEY (id_prestador) REFERENCES public.prestadores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: control control_id_system_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control
    ADD CONSTRAINT control_id_system_user_fkey FOREIGN KEY (id_system_user) REFERENCES public.system_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hospitalizaciones hospitalizaciones_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitalizaciones
    ADD CONSTRAINT hospitalizaciones_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: medicamentos medicamentos_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamentos
    ADD CONSTRAINT medicamentos_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: otro_servicios otro_servicios_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otro_servicios
    ADD CONSTRAINT otro_servicios_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: procedimientos procedimientos_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedimientos
    ADD CONSTRAINT procedimientos_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recien_nacidos recien_nacidos_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recien_nacidos
    ADD CONSTRAINT recien_nacidos_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transaccion transaccion_id_control_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT transaccion_id_control_fkey FOREIGN KEY (id_control) REFERENCES public.control(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: urgencias urgencias_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urgencias
    ADD CONSTRAINT urgencias_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_transactions user_transactions_id_transaction_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_transactions
    ADD CONSTRAINT user_transactions_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transaccion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_transactions user_transactions_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_transactions
    ADD CONSTRAINT user_transactions_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 9LwPAX8bcSaKh6IBnJb7FuCeRwa5UpMAxDYJaEXXsGFkEpCUjWWeBkJphukaN7B

