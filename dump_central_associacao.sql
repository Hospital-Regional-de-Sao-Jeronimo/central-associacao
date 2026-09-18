--
-- PostgreSQL database dump
--

\restrict AzXpXhv140te03qJOxr8gyBMPGPDN17MpbZLf4xwd2eyQbcGF7U79rhW3MDeuna

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.ldap_users_username_key;
DROP INDEX IF EXISTS public.ldap_users_email_key;
DROP INDEX IF EXISTS public.ldap_users_cpf_key;
DROP INDEX IF EXISTS public.associates_email_key;
DROP INDEX IF EXISTS public.associates_cpf_key;
DROP INDEX IF EXISTS public.associates_card_number_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.partner_benefits DROP CONSTRAINT IF EXISTS partner_benefits_pkey;
ALTER TABLE IF EXISTS ONLY public.ldap_users DROP CONSTRAINT IF EXISTS ldap_users_pkey;
ALTER TABLE IF EXISTS ONLY public.home_content DROP CONSTRAINT IF EXISTS home_content_pkey;
ALTER TABLE IF EXISTS ONLY public.associates DROP CONSTRAINT IF EXISTS associates_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.partner_benefits;
DROP TABLE IF EXISTS public.ldap_users;
DROP TABLE IF EXISTS public.home_content;
DROP TABLE IF EXISTS public.associates;
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."BenefitCategory";
--
-- Name: BenefitCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BenefitCategory" AS ENUM (
    'ALIMENTACAO',
    'SAUDE',
    'LAZER',
    'EDUCACAO',
    'SERVICOS',
    'VAREJO',
    'OUTROS'
);


ALTER TYPE public."BenefitCategory" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: associates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.associates (
    id text NOT NULL,
    name text NOT NULL,
    cpf text,
    email text,
    phone text,
    birth_date timestamp(3) without time zone,
    address text,
    admission_date timestamp(3) without time zone,
    association_date timestamp(3) without time zone,
    card_number text,
    card_retrieved boolean DEFAULT false NOT NULL,
    card_retrieved_at timestamp(3) without time zone,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.associates OWNER TO postgres;

--
-- Name: home_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.home_content (
    id text DEFAULT 'default-home-content'::text NOT NULL,
    hero_badge text DEFAULT 'Associação dos Funcionários do HRSJ'::text NOT NULL,
    hero_title text DEFAULT 'União, Valorização e Benefícios para os Servidores do HRSJ'::text NOT NULL,
    hero_subtitle text DEFAULT 'Desde 1995, atuamos na integração, apoio social e busca contínua de vantagens exclusivas para os profissionais de saúde e colaboradores do Hospital Regional São José.'::text NOT NULL,
    foundation_year text DEFAULT '1995'::text NOT NULL,
    foundation_date text DEFAULT '15 de Maio'::text NOT NULL,
    board_badge text DEFAULT '• Diretoria Eleita Ativa'::text NOT NULL,
    board_title text DEFAULT 'Gestão Atual (Biênio 2025 / 2027)'::text NOT NULL,
    board_subtitle text DEFAULT 'Liderança e Transparência'::text NOT NULL,
    board_members jsonb DEFAULT '[{"role": "Presidente", "fallbackName": "Dr. Roberto Carlos Medeiros", "fallbackSubtext": "Corpo Médico HRSJ"}, {"role": "Vice-Presidente", "fallbackName": "Dra. Juliana Barbosa Santos", "fallbackSubtext": "Enfermagem Geral"}, {"role": "Tesoureiro Geral", "fallbackName": "Marcelo Oliveira Silva", "fallbackSubtext": "Setor Administrativo"}, {"role": "Secretária Geral", "fallbackName": "Ana Paula da Silva", "fallbackSubtext": "Recursos Humanos"}]'::jsonb NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    history_blocks jsonb DEFAULT '[{"id": "block-1", "title": "Nossa História & Fundação", "content1": "A Associação dos Funcionários do Hospital Regional São José foi fundada em 15 de maio de 1995 a partir da iniciativa de uma comissão de servidores que buscava fortalecer a união da categoria e criar uma rede de apoio mútuo entre os profissionais da saúde.", "content2": "Ao longo de três décadas de história, a associação expandiu sua atuação, tornando-se referência na promoção de bem-estar, celebrações comunitárias e convênios na Grande Florianópolis."}, {"id": "block-2", "title": "Por que & Por quem fomos criados?", "content1": "Criada pelos próprios servidores do HRSJ (médicos, enfermeiros, técnicos, farmacêuticos, administrativos e equipe de apoio), a associação tem como missão cuidar de quem dedica a vida ao cuidado dos outros.", "content2": "Nosso objetivo é proporcionar benefícios financeiros reais (descontos no comércio, saúde e educação), carteirinha de identificação oficial de associado e eventos sociais de integração."}]'::jsonb NOT NULL
);


ALTER TABLE public.home_content OWNER TO postgres;

--
-- Name: ldap_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ldap_users (
    id text NOT NULL,
    username text NOT NULL,
    nome_completo text NOT NULL,
    email text NOT NULL,
    telefone text,
    cpf text NOT NULL,
    departamento text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.ldap_users OWNER TO postgres;

--
-- Name: partner_benefits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_benefits (
    id text NOT NULL,
    name text NOT NULL,
    category public."BenefitCategory" DEFAULT 'OUTROS'::public."BenefitCategory" NOT NULL,
    discount_percentage text NOT NULL,
    description text,
    location text NOT NULL,
    phone text,
    website text,
    image_url text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.partner_benefits OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'ADMIN'::public."Role" NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: associates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.associates (id, name, cpf, email, phone, birth_date, address, admission_date, association_date, card_number, card_retrieved, card_retrieved_at, active, created_at, updated_at, deleted_at) FROM stdin;
fde38707-4b11-4010-82fe-08a4ba328e42	Ana Maria da Silva	\N	\N	\N	\N	Departamento: Rua Adolfo Donato Da Silva, 100, Kobrasol, SãO José - SC	\N	\N	\N	t	2015-04-20 00:00:00	t	2026-08-31 12:20:25.313	2026-09-01 12:01:28.735	\N
c13aa110-d33e-4796-8b09-9e6783800150	Carlos Eduardo Oliveira	\N	\N	\N	\N	Departamento: Av. Presidente Kennedy, 500, Campinas, SãO José - SC	\N	\N	\N	f	\N	t	2026-08-31 12:20:25.313	2026-09-01 12:01:28.739	\N
f0147cdf-bc0d-49cd-8d3a-1bf98b9e7e08	Juliana Barbosa Santos	\N	\N	\N	\N	Departamento: Rua Leoberto Leal, 250, Barreiros, SãO José - SC	\N	\N	\N	t	2010-07-05 00:00:00	t	2026-08-31 12:20:25.313	2026-09-01 12:01:28.741	\N
83d13b08-7d5c-4ec5-a02a-5bf4d93acc84	Mateus Peres Lopes	\N	\N	\N	\N	Departamento: TI / Tecnologia da Informação	\N	\N	\N	f	\N	t	2026-09-01 11:31:59.904	2026-09-01 12:01:28.743	\N
629504e0-4c61-400b-93e4-7e0da8a60f50	Everton Zanardo	\N	\N	\N	\N	Departamento: Patrimonio	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.424	2026-09-01 11:40:31.424	\N
b65921b4-27ec-4dd8-aa13-cb15f05fcb8b	Rosa Coutinho	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.426	2026-09-01 11:40:31.426	\N
f9c3d5ee-d594-457e-b1d8-bdc9cbb24240	Luana Marques	\N	\N	\N	\N	Departamento: Psicologia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.428	2026-09-01 11:40:31.428	\N
0ffb7137-4b62-46ea-afa6-015ab5d5e342	Thais da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.429	2026-09-01 11:40:31.429	\N
53462f18-4d61-4897-8019-7820f4a0dac6	Clarissa Cappa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.431	2026-09-01 11:40:31.431	\N
aa10b838-b271-468f-b2b7-670b46d56f2f	Diogenes Pansera	\N	\N	\N	\N	Departamento: TI / Tecnologia da Informação	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.403	2026-09-01 12:01:28.745	\N
cbf98354-20c3-4fba-a901-a7a0802bb16a	Juliana Muller	\N	\N	\N	\N	Departamento: TI / Tecnologia da Informação	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.415	2026-09-01 12:01:28.747	\N
c6e6ded1-9e4a-4fe1-a0b5-84756c970887	Cibele Pereira da Rosa	\N	\N	\N	\N	Departamento: NIR	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.436	2026-09-01 11:40:31.436	\N
2db953b5-ea57-4984-974e-42c7a94283b6	Maiara Silva Leão	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.437	2026-09-01 11:40:31.437	\N
b2b2630d-a165-4369-8af9-75c8a3be15bc	Adryan Souza da Cruz	\N	\N	\N	\N	Departamento: Arquivo	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.44	2026-09-01 11:40:31.44	\N
16077ba1-c3bc-4cfc-b19a-881c743838e2	Rosalaine Boeira Pizzio	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.476	2026-09-01 11:40:31.476	\N
f620931a-10f0-43d2-8db2-b26a2bb24e68	Gabriela Garcia de Azevedo	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.52	2026-09-01 11:40:31.52	\N
8ef87c44-d605-43b2-8439-1252f8cdd0ce	Ana Paula Menezes Carneiro	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.522	2026-09-01 11:40:31.522	\N
2d78f17d-1fc9-42b4-b4ae-a991edd215f4	Akira da Silva Lima	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.569	2026-09-01 11:40:31.569	\N
2fc1ebd0-b1c6-476a-b110-0340ad8fbbc3	Ericson Goncalves	\N	\N	\N	\N	Departamento: Recursos Humanos	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.479	2026-09-01 11:40:31.479	\N
800ab391-0070-492e-b96b-cfd9aa692d8b	Rafaela Dornelles Thome	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.483	2026-09-01 11:40:31.483	\N
942be869-4ea7-48b2-b4ff-342691f5f905	Bruna Machado Serpa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.105	2026-09-01 11:45:52.105	\N
b003eaf4-e88a-46a4-8dc2-f4c9329189f3	Paricia Luz Coimbra	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.106	2026-09-01 11:45:52.106	\N
299c3fe0-8cf2-45cd-88aa-968a286160dc	Bruno Garcia dos Santos	\N	\N	\N	\N	Departamento: Financeiro	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.484	2026-09-01 11:40:31.484	\N
fb5c28da-b943-4d50-8263-4ee0ab66b40f	Daiane Soares de Abreu	\N	\N	\N	\N	Departamento: Contabilidade	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.492	2026-09-01 11:40:31.492	\N
c8bae923-576e-417b-b552-1d432f02319e	Rosane Elisabete Stoffels	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.497	2026-09-01 11:40:31.497	\N
05591061-3ce8-4db6-b824-b80638ff776f	Fabiane Brasil da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.228	2026-09-01 11:45:52.228	\N
4867b111-f07d-4c0d-a411-189358511412	Nathalia Cardias Vargas	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.232	2026-09-01 11:45:52.232	\N
1ed40599-6cad-41a7-bf6d-1b63498e6a0c	Daniela Freitas Atkinson	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.27	2026-09-01 11:45:52.27	\N
063df1b2-6cd8-4998-99a5-de99a9fc9db8	Natalia Rodrigues Bizarro	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.308	2026-09-01 11:45:52.308	\N
44ff5268-c2e7-42fd-b801-5e246d241136	Gabriela de Paoli Marques	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.311	2026-09-01 11:45:52.311	\N
521f5a43-22e6-4766-9413-40de8dd610a6	Catia Maria Ramos de Moura	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.35	2026-09-01 11:45:52.35	\N
3ab27839-9e34-47bd-9cce-b7fd57537f74	Stephany Victoria Gonçalves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.354	2026-09-01 11:45:52.354	\N
2c782040-ea03-4698-a774-ae9ba5e9eb84	Caroline Bonness Gibinski	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.498	2026-09-01 11:40:31.498	\N
c2b09e17-c2f2-42c1-802d-694b61d31b15	Joiceli de Souza Possaura	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.502	2026-09-01 11:40:31.502	\N
d66f1a62-e3ba-44c8-b527-a71072b94983	Larissa Pereira Righi da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.42	2026-09-01 11:45:52.42	\N
47a16ccc-5cff-49ac-8769-2d795b7b12af	Vivian Tessaro Lopes Rodrigues	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.421	2026-09-01 11:45:52.421	\N
01f1b4c8-b3d8-426f-9841-9b9179659a49	Patricia Eberhardt de Souza Vieira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.455	2026-09-01 11:45:52.455	\N
ed6da9b7-cdbb-4956-81eb-768fd87a211f	Illayanna Tatila Ferreira de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.456	2026-09-01 11:45:52.456	\N
f48d37e7-18ed-4304-9b97-c0cfeca2b408	Kelen Correia Leites	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.489	2026-09-01 11:45:52.489	\N
2679b580-6071-4575-a54b-f5b1c04dec95	Gislaine Bibiano Tavares	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.49	2026-09-01 11:45:52.49	\N
8b646bcf-f1b6-4a2a-b4be-208fde243993	Marina Silva Correa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.491	2026-09-01 11:45:52.491	\N
37928c49-f3f9-44ce-9c20-1c2a541ed4c1	Antonio Joao Caldana	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.526	2026-09-01 12:01:29.106	\N
ad6fddcc-77e1-4bc9-8a68-6f7fe51111af	Berenice Lago Flores Cernicchiaro - Me	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.527	2026-09-01 12:01:29.107	\N
5d5da831-2411-4566-85e3-772717c67cd5	Francieli Pereira de Morais	\N	\N	\N	\N	Departamento: Financeiro	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.504	2026-09-01 11:40:31.504	\N
c26941cf-9c25-4a9c-a57d-ea607dfcc5de	Bernardo Martins da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.506	2026-09-01 11:40:31.506	\N
81bcf6fa-973c-4456-8835-078f622fb16f	Jose Felipe Rodrigues Serpa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.608	2026-09-01 12:01:29.185	\N
356b35ac-153a-4a11-9ce2-199f8ef39ec8	Francieli de Souza Duarte	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.508	2026-09-01 11:40:31.508	\N
bee0616b-6485-4df5-9840-d04fe44eccfd	Rodrigo Stropper da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.509	2026-09-01 11:40:31.509	\N
08e209bf-d551-4b54-b8b7-2f393c0b0263	Priscila dos Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.686	2026-09-01 12:01:29.258	\N
54e789d5-52db-49a8-9175-967be9c73194	Marla Tais Lima dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.517	2026-09-01 11:40:31.517	\N
82baf243-66df-4d7e-99c8-51d4664b4357	Aline Kruger Ramos Widenhoft	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.478	2026-09-01 12:01:28.777	\N
4f502c10-a740-486d-9083-1ae036e109b5	Pablo Aires dos Santos	\N	\N	\N	\N	Departamento: TI / Tecnologia da Informação	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.418	2026-09-01 12:01:28.749	\N
1fb124ae-6dfe-4d35-a6d2-18ca75df861f	Sara Pricila Fortes Costa	\N	\N	\N	\N	Departamento: TI / Tecnologia da Informação	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.419	2026-09-01 12:01:28.751	\N
61a840ed-9b89-4909-a3cb-7d51ac8bf5c9	Rodrigo Pedroso Poeta	\N	\N	\N	\N	Departamento: TI / Tecnologia da Informação	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.421	2026-09-01 12:01:28.753	\N
50410e74-e615-45fc-b881-9ac45d50f2c9	Jaqueline Lompa	\N	\N	\N	\N	Departamento: Hospital Regional SãO JerôNimo	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.423	2026-09-01 12:01:28.755	\N
fe4c1cf9-be66-4cd4-bc8d-b7f185b0e5be	Genesi Souza da Silva	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.442	2026-09-01 11:40:31.442	\N
48def5ff-01e8-4426-8a41-b3605d30e766	Yasmin Souza Conci	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.443	2026-09-01 11:40:31.443	\N
c983e362-1505-4125-84fd-4bcb5588d291	Alan Azeredo Alves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.444	2026-09-01 11:40:31.444	\N
086097cc-7b94-409b-8673-48ae43fb032a	Edna Quelen dos Santos	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.446	2026-09-01 11:40:31.446	\N
533dc0ab-4688-4ff3-8640-c7fb08c68475	Tarcysio da Silva Souza	\N	\N	\N	\N	Departamento: Gestao Ambiental	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.448	2026-09-01 11:40:31.448	\N
7f8de56a-b468-4aad-a8b5-abcd1cc2b9b4	Patricia De Azeredo Ferrão	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.451	2026-09-01 11:40:31.451	\N
4ee5b3f6-e15c-4516-a3d1-40be904cf278	Luana Lucas de Souza	\N	\N	\N	\N	Departamento: Financeiro	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.452	2026-09-01 11:40:31.452	\N
61db3945-b302-47be-81b4-c083b85e6648	Leonardo Avila da Silva	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.454	2026-09-01 11:40:31.454	\N
e0e7c12c-2589-44c4-8158-09cf08faf0ba	Amanda de Souza Luiz	\N	\N	\N	\N	Departamento: Medicina Hospitalar	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.458	2026-09-01 11:40:31.458	\N
cdb280ee-7bbb-4456-85f8-55dbb3c4f614	Carla Marques Guntzel	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.46	2026-09-01 11:40:31.46	\N
e7aff0af-f1af-4f33-b4ad-749f38f73d21	Thiago Gimenes Vieira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.462	2026-09-01 11:40:31.462	\N
da7e19a8-4954-43e6-b825-1085fea5b238	Julhana Silveira Leao	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.464	2026-09-01 11:40:31.464	\N
6575d21d-2846-4c54-bb79-3b1468d3026d	Simone Santos da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.467	2026-09-01 11:40:31.467	\N
623c4c94-a255-4c98-a5a8-08748627649c	Bruna da Silveira Bica	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.469	2026-09-01 11:40:31.469	\N
3bf56c0b-7dfc-4887-8197-7ec52a23fe5d	Claudia Mausolff Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.472	2026-09-01 11:40:31.472	\N
0ba42f5c-48ef-4207-8eb5-54a6aca85205	Vitoria Andrade Da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.473	2026-09-01 11:40:31.473	\N
277dfbce-6dbd-4d3e-8ff2-ea38fc4740fa	Marli Bargas Nascimento	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.475	2026-09-01 11:40:31.475	\N
14c9cecc-5155-47a1-a598-d01052e39b1b	Adriana da Rosa	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.438	2026-09-01 12:01:28.758	\N
5be7ab46-45a9-40a3-851c-096f3ed085e5	Wagner Maia Lopes	\N	\N	\N	\N	Departamento: Manutenção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.439	2026-09-01 12:01:28.759	\N
1eee8da5-5468-4eca-be32-d9d32f281a60	Daniele Fantin	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.445	2026-09-01 12:01:28.76	\N
b832a0dd-dcf8-45dd-a827-a2470b809966	Ana Rita Lopes Cairuga	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.45	2026-09-01 12:01:28.761	\N
07bd9bc9-d9c1-4be8-bff6-1d496a02fc58	Marisandra Santos	\N	\N	\N	\N	Departamento: Administração	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.453	2026-09-01 12:01:28.763	\N
20297681-b44a-458e-b2ae-516a472f182d	Rita de Cassia Martins	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.455	2026-09-01 12:01:28.765	\N
f2bb9a02-e546-404a-a9c7-5ac151fc303b	Fabiano Silveira Machado	\N	\N	\N	\N	Departamento: Segurança do Trabalho / SESMT	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.457	2026-09-01 12:01:28.766	\N
cc07c121-d009-4fec-bb2f-eb44cc2d84f3	Daiane Silva Silveira	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.459	2026-09-01 12:01:28.767	\N
919c2257-b6bb-47cf-b452-a4ad4285b047	Leonardo Peixoto Correa	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.461	2026-09-01 12:01:28.769	\N
d5b620f9-11fd-48c0-8953-d60a1465f459	Andreina Pacheco Santos	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.463	2026-09-01 12:01:28.77	\N
5b7d3f7b-9036-49e9-8494-716b1630498b	Bruna Rocha da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.466	2026-09-01 12:01:28.771	\N
c94f46ee-d750-48b1-af0e-182ff7defaff	Karina Govoni de Azevedo	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.468	2026-09-01 12:01:28.772	\N
bee5144e-934e-4511-93c0-4096024ac98a	Jociel da Rosa Machado	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.474	2026-09-01 12:01:28.774	\N
d063ba07-fdcf-48a1-a8aa-5af63702ce76	Luiza Almeida Sandrin	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.633	2026-09-01 12:01:29.208	\N
a2d774a2-1219-4234-8b1c-5b97dac3c6d7	Glaucio Almeida Castilhos	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.48	2026-09-01 12:01:28.778	\N
c07e8e2e-5a17-44ea-aa6d-4004727b944c	Graziela Tavares de Souza	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.482	2026-09-01 12:01:28.78	\N
7d3b5764-6f0f-4194-a5b2-8cb34d44c634	Vinicius dos Santos Lemos	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.487	2026-09-01 12:01:28.782	\N
216cad3e-00c5-4d40-b0ce-3e54a276ee0e	Leticia Santos de Souza	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.488	2026-09-01 12:01:28.783	\N
95936285-bf07-4109-a887-8cbffdd745d1	Alison Vieira Cardoso	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.495	2026-09-01 15:03:54.498	\N
61220374-a3b4-4307-83df-27a84a201207	Roberta dos Santos Ribeiro	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.491	2026-09-01 12:01:28.785	\N
1e52dc4d-b23e-4cf9-a944-e004f55935a9	Daniela Moraes da Luz	\N	\N	\N	\N	Departamento: Serviço Social	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.493	2026-09-01 12:01:28.786	\N
91732f2a-2424-4860-a0b7-238893a664cc	Ana Claudia da Silva	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.494	2026-09-01 12:01:28.788	\N
50b1c682-3b80-4d27-843b-9ed011f7887f	Renan Martins Anselmo	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.5	2026-09-01 15:03:54.499	\N
5ab5fce4-f392-4054-932a-989f1a369c69	Julia da Silva Pilger	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.507	2026-09-01 15:03:54.501	\N
6bb8806a-0bc8-4949-930e-547ad2f28e5e	Julio Cezar Amaral da Silva	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.501	2026-09-01 12:01:28.791	\N
258e5aab-88bf-40d2-ad4c-aa6f9bb407c5	Flavio Damasceno Teixeira	\N	\N	\N	\N	Departamento: Manutenção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.503	2026-09-01 12:01:28.793	\N
e784e951-c73b-4e7d-8c83-eecc4308016c	Simone Santos Pereira Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.505	2026-09-01 12:01:28.794	\N
6ddcea34-203b-4383-a446-c47eb880bb0a	Erica da Silva Carocas	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.51	2026-09-01 15:03:54.503	\N
2dce0755-973a-4d7c-8cb7-657fddea18bc	Matheus Filipe de Abreu Azevedo	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.515	2026-09-01 15:03:54.504	\N
1df5efc0-d0fe-433b-84ea-6c0b77378c8a	Fabiano Machado	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.512	2026-09-01 12:01:28.8	\N
10000236-2b89-4b09-a526-1dceae727b2a	Bruna Maria da Silva Back	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.513	2026-09-01 12:01:28.801	\N
8bdc3d40-832d-4975-80e6-792b0fc54e56	Juliana Batistela dos Santos	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.516	2026-09-01 12:01:28.805	\N
04550e04-211d-4248-8794-f7dbce712631	Renan Vieira Schwarz	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.49	2026-09-01 15:03:54.492	\N
bb815daf-7f74-4bac-994b-8b14e7e441a6	Marcela Susane da Silva Porto	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.523	2026-09-01 11:40:31.523	\N
7f060c70-389d-401d-8254-bd4a86d44920	Renato Leandro Borba Prates	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.524	2026-09-01 11:40:31.524	\N
b4dddb5c-88bf-4efc-87eb-18f646c1e364	Maria Silvana de Souza Dias	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.525	2026-09-01 11:40:31.525	\N
074adab4-21e3-4581-9971-66eb8c4c980e	Carlinda Santos de Souza	\N	\N	\N	\N	Departamento: Contabilidade	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.528	2026-09-01 11:40:31.528	\N
e70ae6f7-0265-4cb4-b3b8-729c496d24d3	Andreliz Nair Souza de Lima	\N	\N	\N	\N	Departamento: Psicologia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.529	2026-09-01 11:40:31.529	\N
98a396a9-df94-4e9f-bc62-c30beda674ef	Lucas dos Santos Figueiredo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.53	2026-09-01 11:40:31.53	\N
c1986fe2-e89e-4518-8b3b-82e02bf250ea	Priscila Albuquerque Marins	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.532	2026-09-01 11:40:31.532	\N
1a2d8ced-de16-4aae-85bc-27fbed6cd216	Bruna Fernanda Santos Pedroso	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.54	2026-09-01 11:40:31.54	\N
7d731692-86b0-47ac-8433-6e81380e1282	Lucas Assis Freitas Porto	\N	\N	\N	\N	Departamento: Recursos Humanos	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.544	2026-09-01 11:40:31.544	\N
c4779479-c346-47bf-be43-5791e9e0977b	Barbara Pedroso dos Santos	\N	\N	\N	\N	Departamento: Recursos Humanos	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.545	2026-09-01 11:40:31.545	\N
0e81968e-dd5c-47bd-a194-06a47f71de0c	Lisiane Renata Santos da Silveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.546	2026-09-01 11:40:31.546	\N
0e726492-a805-40dd-9b59-d12bcf0d8cbe	Guilherme Nunes dos Santos Noronha	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.549	2026-09-01 11:40:31.549	\N
6f5b0a46-e602-47d3-bd39-09317734280b	Sonia Maria dos Santos Monteiro	\N	\N	\N	\N	Departamento: Selecao Treinamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.552	2026-09-01 11:40:31.552	\N
2df5d782-404c-4ef0-be5f-73670499b5a4	Alex Vasconcellos Vargas	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.521	2026-09-01 12:01:28.807	\N
24a442dc-1def-40e2-ac1c-efd0c1d164c8	Eduarda Quadros Widenhoff	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.526	2026-09-01 12:01:28.809	\N
58648c07-16f0-4e62-bdd8-587dcab2eb48	Brenda de Franceschi da Silva	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.534	2026-09-01 12:01:28.811	\N
3ab9d516-510e-47e0-a359-bfca821e12ea	Liliane Coelho da Conceição	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.543	2026-09-01 15:03:54.507	\N
f2b47499-70f1-44c8-821c-52fe7935eae4	Kauana Junqueira da Silva Abreu	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.536	2026-09-01 12:01:28.814	\N
057d334a-bc2b-4eba-8823-bbe573cbfebe	Giovani Aurelio Silva Simas	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.538	2026-09-01 12:01:28.815	\N
d19c8424-515e-4f2d-83fb-bc018f825fcd	Vainer Guerreiro dos Santos	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.539	2026-09-01 12:01:28.817	\N
80a48c26-203e-4847-808c-dde5f180e244	Ana Claudia Silva de Souza	\N	\N	\N	\N	Departamento: Administração	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.541	2026-09-01 12:01:28.818	\N
72321dab-4814-4180-a1ab-33cb32a51b89	Marcos Antonio Santos da Silva	\N	\N	\N	\N	Departamento: Manutenção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.542	2026-09-01 12:01:28.819	\N
a3142188-64f6-4086-b1d3-07b36c4887c0	Fernanda Pereira Lopes Almeida	\N	\N	\N	\N	Departamento: Serviço Social	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.548	2026-09-01 12:01:28.821	\N
4266444d-0ba1-48d9-8053-ad38f758529e	Carla Renata dos Santos Assis	\N	\N	\N	\N	Departamento: Controle de Infecção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.55	2026-09-01 12:01:28.822	\N
d594b63d-0557-4c3b-b4f9-72845a787b14	Ivanea Terezinha Garboca da Silva	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.551	2026-09-01 12:01:28.823	\N
2e96c8b2-4852-49ce-bec9-f96b96ada121	Thamara Regina Antonio do Carmo Henn	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.553	2026-09-01 12:01:28.824	\N
d47cae83-c666-48b1-ad2a-6ca86a86f86d	Rodrigo Ferraz Job	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.554	2026-09-01 12:01:28.825	\N
62883cf9-f092-4de2-ad70-81a15d07401e	Angelo Fazenda Muller	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.555	2026-09-01 12:01:28.826	\N
4706cd9e-8061-412e-9893-62512456849c	Tiele da Silva Flores	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.104	2026-09-01 12:01:28.827	\N
ad1402ea-b185-4ea5-a48d-b13a71f359f1	Marcone Silveira Martins	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.535	2026-09-01 15:03:54.505	\N
ab012e10-4d83-4813-a4df-d22917633110	Gisele Carvalho da Silveira Bonato	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.592	2026-09-01 11:40:31.592	\N
abc75520-b0d3-41ef-a10a-c307b020b9f1	Milena Neves Junqueira	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.556	2026-09-01 12:01:28.828	\N
6f36c59b-f0d1-438f-8021-5f0fbab36b7a	Sarah dos Santos Poeta	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.557	2026-09-01 12:01:28.829	\N
2bcd57fc-7219-4d14-a505-51ffd0657311	Mari Luci Alves Barcelos	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.559	2026-09-01 12:01:28.832	\N
283c841e-7b81-46fe-a8a3-29e565b9794a	Ana Alice Marques Figueira	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.56	2026-09-01 12:01:28.833	\N
13f50b96-d5ac-4933-a6c8-663aa015d9f7	Debora Vieira da Silva	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.562	2026-09-01 12:01:28.834	\N
e695be64-abe6-4a66-868d-61d0bdc2c94a	Vanessa de Almeida Carvalho	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.563	2026-09-01 12:01:28.835	\N
b024d7e3-4a10-425a-ab06-a177a3de8a9d	Nathalia Patriny Santos Souza	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.564	2026-09-01 12:01:28.836	\N
1f9c2997-d7ec-4cea-a177-096947855e8d	Ana Paula da Silva Ortiz	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.565	2026-09-01 12:01:28.837	\N
c9edc7f7-bd96-443b-a492-572ed7334301	Andressa Mirian de Souza Frois Vargas	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.566	2026-09-01 12:01:28.838	\N
4fd578f4-0542-47ee-a346-7e6e452cce8b	Marcos Gabriel Rosa da Silveira	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.568	2026-09-01 12:01:28.839	\N
aaf212ee-f9e9-479f-b952-738f77d2214d	Ivan Pastorini de Oliveira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.57	2026-09-01 12:01:28.84	\N
5d1c43b3-d94c-4e9f-b85b-e6a0474a9f01	Juliana Nery Ferrari	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.571	2026-09-01 12:01:28.841	\N
edd1dbb6-20d1-4bcf-b01f-35514cc7e796	Luiz Fernando Carpes Masella	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.572	2026-09-01 12:01:28.842	\N
7084a1fd-3bab-4fcb-9903-e9d5d114408f	Mauricio Specterow	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.573	2026-09-01 12:01:28.843	\N
4cbed3a1-9f75-4915-ae47-c685f1f17d30	Mohammd Ali Nedal Mohammad Ramahi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.574	2026-09-01 12:01:28.845	\N
b1684621-48bd-4821-bd6d-ad6664ad9102	Murilo Kubiak	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.575	2026-09-01 12:01:28.846	\N
db743ab1-c9df-4576-94ba-e4a8a9dbe8ba	Rafaela Hoffmann Miranda	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.576	2026-09-01 12:01:28.848	\N
0937a764-c326-4031-a052-6f5f62de79b6	Rafael Dal Ponte Ferreira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.577	2026-09-01 12:01:28.849	\N
55951e3b-08b7-48ca-9d4e-d89d2b1b0506	Ricardo Kunde Minuzzi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.579	2026-09-01 12:01:28.852	\N
d643bd4f-9dda-42ee-baba-80356c15b60d	Richiele Forgiarini Portella	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.581	2026-09-01 12:01:28.853	\N
4fee2d8a-872c-4f7f-90d8-a890c2067e37	Rodrigo Lopes Decusati	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.582	2026-09-01 12:01:28.854	\N
1b08ad35-0422-442f-8836-abe1e9660fe6	Rosana Caroline Dieterich Junqueira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.583	2026-09-01 12:01:28.855	\N
690d750d-4439-43d1-a4ba-7fb0b50fc091	Medico HCSJ	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.584	2026-09-01 12:01:28.856	\N
52dbc163-31d6-4f7e-aedb-e47b494e8ee7	Michele Duvirgem Dornelles	\N	\N	\N	\N	Departamento: Recursos Humanos	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.586	2026-09-01 12:01:28.857	\N
d846a0fb-534e-43d2-84fc-90551c1b22bc	Gisele Flores	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.586	2026-09-01 12:01:28.858	\N
c02b7b11-24fb-4f70-8409-5bdebe438655	Kevin Verdin Phillips	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.587	2026-09-01 12:01:28.859	\N
ef5b32eb-df44-4f6e-8d21-014029ed55c2	Pedro Enrique Stumm Pires	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.589	2026-09-01 12:01:28.86	\N
1d8ca382-afdd-4103-adce-7b0fed03e49b	Yuri Morais Wrague	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.59	2026-09-01 12:01:28.861	\N
90fe6740-46ff-4612-bc99-fc5b66b7f34f	Vinicius Cassol da Rosa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.591	2026-09-01 12:01:28.863	\N
a231c255-9df6-4bfb-9a2e-03079900badd	Júlia Helena de Castro Loureiro	\N	\N	\N	\N	Departamento: Administração	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.593	2026-09-01 12:01:28.864	\N
0f4c076b-89d1-4302-81a4-be894ad63837	Thaise da Silva Pedroso	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.558	2026-09-01 15:03:54.511	\N
7bb0461f-820e-49de-8edf-cc54d681eb42	Keila Pinto	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.055	2026-09-01 11:45:52.055	\N
d66ac523-a0c2-4b2f-b00d-81cbddef2ae5	Amanda Lopes	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.056	2026-09-01 11:45:52.056	\N
cb44fadc-6965-4ba1-8316-9a45f2e7adb8	Ketlen Franco	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.058	2026-09-01 11:45:52.058	\N
a0d007d2-20b0-4f4b-b994-1f2d9cf998b9	Denize da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.063	2026-09-01 11:45:52.063	\N
4c276985-7eb4-4028-98b8-595aee936f73	Julia Gonçalves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.065	2026-09-01 11:45:52.065	\N
c3e4aab5-f1aa-41a5-8614-7dad79515f18	Selma Alves Rosa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.07	2026-09-01 11:45:52.07	\N
ab197800-e04f-4fd3-a331-7559c1afad44	Gabriel Ribeiro Leao	\N	\N	\N	\N	Departamento: Arquivo	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.074	2026-09-01 11:45:52.074	\N
341c07fd-f510-48c0-a0a4-53dc5b82defb	Davi Rocha Barros	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.075	2026-09-01 11:45:52.075	\N
1728e83c-cdad-4f89-8949-da7911c449b4	Suelen Bueno Sena	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.076	2026-09-01 11:45:52.076	\N
9c1bb0cd-16d0-4ba9-bd5d-3ac00b159f1d	Jaiane Valdez Sena	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.079	2026-09-01 11:45:52.079	\N
305453dc-bfd6-4dec-88ce-fd6a2cebd7f0	Erika Lucas Vieira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.08	2026-09-01 11:45:52.08	\N
d9618152-1c85-4f9c-9348-0a5a5673c0e1	Marcelo Salati Angelo	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.085	2026-09-01 11:45:52.085	\N
eab66ed3-d802-4e6a-a8dd-06690e9ca0ed	Cassia Santos Brum	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.087	2026-09-01 11:45:52.087	\N
3223979b-eb26-4f91-8f52-244e067f71ef	Bruna Souza Vieira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.088	2026-09-01 11:45:52.088	\N
0cbbf888-6b64-4655-a609-6012d58c77ba	Jessica Pugues Rosa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.09	2026-09-01 11:45:52.09	\N
37941dde-30a2-4cb5-8fc9-1bd42474ccdd	Luana Soares Macedo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.091	2026-09-01 11:45:52.091	\N
4022e4e9-e80b-4b3b-90e6-beaf58da5d19	Bruna Esteves Cunha	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.095	2026-09-01 11:45:52.095	\N
159968df-0a8b-4cd8-bc0a-d601fb87d2ef	Mayara Sanches Maia	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.099	2026-09-01 11:45:52.099	\N
08982031-3599-47d6-95a5-bcaf51c2d6a8	Hiago Lizardi Rocha	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.101	2026-09-01 11:45:52.101	\N
e0206dce-f850-41b8-854c-2255f82b9eb1	Rosana Lima da Rosa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.103	2026-09-01 11:45:52.103	\N
232e7c34-af16-41f0-bf6a-eb88df54ae9f	Ritanara Avila	\N	\N	\N	\N	Departamento: Hospital Regional SãO JerôNimo	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.05	2026-09-01 12:01:28.867	\N
5311e0b7-68d8-4b63-afca-0a0975dc8f57	Adriana Diniz	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.061	2026-09-01 12:01:28.868	\N
aadfc6c1-62f0-48c0-b44e-2bcca455960b	Eronita Mazui	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.067	2026-09-01 12:01:28.869	\N
34fcd95d-49d2-44c1-80ef-40be46436744	Luana Flores Silva	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.071	2026-09-01 12:01:28.87	\N
361154a7-4719-4187-afd0-553ec6a55b14	Kenya Brum Costa	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.073	2026-09-01 12:01:28.872	\N
9ee5bca3-721c-43c6-9395-b0c825bf8ee9	Willian Lemos Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.078	2026-09-01 12:01:28.873	\N
c7b9a44f-5193-4272-82dc-bbb9ef2f2e4b	Gabriela Abreu Gomes	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.082	2026-09-01 12:01:28.874	\N
b08f4401-3666-425b-9433-8c41b2839b93	Lucas Gomes Lopes	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.083	2026-09-01 12:01:28.875	\N
bab56f24-4a13-41a0-8c07-8d2ad10580f6	Valy Pereira Moreira	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.086	2026-09-01 12:01:28.876	\N
59716e06-0ad7-49c7-be1d-ac3f7dd399b4	Tais Abreu Leotte	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.089	2026-09-01 12:01:28.877	\N
8772da8d-6f02-46ca-8d31-ad0406221367	Thais Fagundes Duarte	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.092	2026-09-01 12:01:28.879	\N
954fa17e-b901-4e7a-996e-7402fdb5af21	Andresa Viana Machado	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.094	2026-09-01 12:01:28.881	\N
e044a984-31a4-4bfb-b633-678f6452ca68	Pamela Batista	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.097	2026-09-01 12:01:28.882	\N
65188b64-763b-456d-aa7a-541d763584dc	Laurita da Silva Maia	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.102	2026-09-01 12:01:28.883	\N
a22700fa-5fc6-43c1-97ce-1e937de1429c	Thaisa Acosta Bicca	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.11	2026-09-01 11:45:52.11	\N
e457907f-9f96-4c4a-ba01-2b137b02a9a5	Maria Angelita Avila	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.112	2026-09-01 11:45:52.112	\N
6282dbaf-13af-465e-97a3-16f89c58aaf5	Sheila Dias de Matos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.115	2026-09-01 11:45:52.115	\N
226a4e89-f058-434b-9188-7cf4c0a7b031	Cassiano de Souza Silva	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.117	2026-09-01 11:45:52.117	\N
ad42b306-d627-4f0d-b10f-7f5d398eca1c	Fabiana Souza Guedes	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.118	2026-09-01 11:45:52.118	\N
588dadb5-4998-4195-9e67-24d436f55be5	Luiza Teixeira Poeta	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.12	2026-09-01 11:45:52.12	\N
857a9113-546d-4c21-a544-be2b88d879f1	Sueli Suéli da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.122	2026-09-01 11:45:52.122	\N
9c993c37-8650-48dd-a26e-d6b792ebb033	Jaqueline Lopes Ruiz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.124	2026-09-01 11:45:52.124	\N
1fd00ea8-996c-44da-b84a-124d3c8dc7d1	Celoi Almeida Cabral	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.126	2026-09-01 11:45:52.126	\N
8b580268-7a6a-4f22-af2b-700325a23f4a	Kassandra Rios Paiva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.127	2026-09-01 11:45:52.127	\N
38a924a8-15cb-42f8-ac93-75386e2ad72c	Tais Camara da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.128	2026-09-01 11:45:52.128	\N
ae35f236-6c50-44ba-af29-e5bad2b5f8c9	Geni Maciel da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.129	2026-09-01 11:45:52.129	\N
99cb87e2-3aca-4473-841a-c15c4932997e	Danielly Pereira Lima	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.132	2026-09-01 11:45:52.132	\N
8335b29c-6867-43bc-9a46-984c0fd07eea	Fernanda Fries Jardim	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.134	2026-09-01 11:45:52.134	\N
85503009-da30-4711-97a0-ab02ffca74f9	Isabel da Silva Braga	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.135	2026-09-01 11:45:52.135	\N
a2e6399b-b3d5-47e0-a2df-f6f4fa8adc88	Marina Martins Tadday	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.136	2026-09-01 11:45:52.136	\N
12046dad-4281-4b41-b8dd-041e90639435	Isaura Lopes da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.137	2026-09-01 11:45:52.137	\N
68955cef-439a-4298-b8ca-f962b708cb81	Emily Martin da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.14	2026-09-01 11:45:52.14	\N
bd7340da-484f-4a74-abab-6874562c4aa7	Sarah Ysys Leal Zakka	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.143	2026-09-01 11:45:52.143	\N
bf70c9df-2c47-43ee-881a-27dfe6bac2be	Carolina Souza Campos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.147	2026-09-01 11:45:52.147	\N
c6259ff9-7cc4-4b9e-8369-f43d3dbf8995	Rita Mara Silva Ramos	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.109	2026-09-01 12:01:28.886	\N
583d1e79-28e2-47e5-8f17-8f14849ff667	Eliete Paula da Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.111	2026-09-01 12:01:28.887	\N
faebabea-10e1-4e65-8944-c783272346fb	Rejane Silveira Santos	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.113	2026-09-01 12:01:28.888	\N
aaafa569-d4f1-42bc-9405-75afd4ed8e2e	Luciano Soares Lopes	\N	\N	\N	\N	Departamento: Manutenção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.121	2026-09-01 12:01:28.889	\N
bb98bf7d-2a3c-4d07-8da1-1b282e814d29	Tatiane Nunes da Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.123	2026-09-01 12:01:28.891	\N
bb3ef00c-b250-4e9e-ba0f-8b149b8c1d5a	Emanuel Juliano Deneck	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.13	2026-09-01 12:01:28.892	\N
c1d1693b-aed9-4fe3-b1f3-a1e50bde8caf	Zélia de Menezes Fortes	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.139	2026-09-01 12:01:28.895	\N
f4284811-1c6a-45f3-adb1-ada58a51180b	Thiago Freitas da Silva	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.141	2026-09-01 12:01:28.896	\N
bb42c9e3-21d9-4025-9210-94631acbd9ed	Patricia Silva de Souza	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.142	2026-09-01 12:01:28.898	\N
0e5bb35a-8b5a-49dc-b715-89e08fda7547	Andreia Vanessa Antunes	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.145	2026-09-01 12:01:28.899	\N
4a5ba6b2-eeda-4f83-88b7-106bbc797f2f	Andre de Oliveira Lopes	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.146	2026-09-01 12:01:28.9	\N
c720921d-311c-422f-89c7-a7b11a3a0891	Tamires Coimbra Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.148	2026-09-01 11:45:52.148	\N
19cd76e5-bcec-4cf9-ac64-78aaf44cb44c	Gabriela Machado Pelz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.149	2026-09-01 11:45:52.149	\N
f7504eee-84c3-4282-9158-a6edc980a3e4	Victor Serpa da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.152	2026-09-01 11:45:52.152	\N
384fabbb-730b-40ca-a53b-b31b5eb113cc	Eduarda Souza Batista	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.155	2026-09-01 11:45:52.155	\N
61503d69-507b-475a-8977-34bf8c47f3c7	Roberta Massena Neves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.157	2026-09-01 11:45:52.157	\N
acdeb751-02ca-405f-96b5-368af70a18a4	Carla Danielle Tormes	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.158	2026-09-01 11:45:52.158	\N
d0b195d4-52fb-473b-8ff0-0b8eb543191d	Vanessa Leal Silveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.159	2026-09-01 11:45:52.159	\N
be43f98c-92ff-4b72-a939-bc73077412d8	Julia Mendes Rodrigues	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.161	2026-09-01 11:45:52.161	\N
323c00f6-a113-476d-a486-050dbbc26c6f	Taina da Silva Machado	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.164	2026-09-01 11:45:52.164	\N
4f68e230-7ae1-47f1-b1ad-9507c32ac6c2	Luana Alves de Azevedo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.165	2026-09-01 11:45:52.165	\N
e2148cd5-2d8b-4868-a49c-d639dee2a138	Robson Correa da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.17	2026-09-01 11:45:52.17	\N
5987d990-b52d-409d-9afc-11604420bb7a	Acsa Pereira Rodrigues	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.171	2026-09-01 11:45:52.171	\N
0ac26da8-167b-4a80-a512-60b9b97aa1bd	Tais Carvalho de Ávila	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.172	2026-09-01 11:45:52.172	\N
db42da73-96eb-4e3c-bcf2-793ad760794c	Roberta Cunha de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.173	2026-09-01 11:45:52.173	\N
24aeb949-57ef-4e82-88c7-883d022b97ba	Monica Correa da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.174	2026-09-01 11:45:52.174	\N
bab896ce-e115-451f-b8d4-9ebfd5d2bdd9	Ketlyn Macedo da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.178	2026-09-01 11:45:52.178	\N
c59f1833-3aca-4ab1-8fb3-c4c4e7bfb691	Sheila Machado Pereira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.179	2026-09-01 11:45:52.179	\N
efe68317-64b3-4abd-ad6b-682ba36a7de4	Clarice Abreu de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.181	2026-09-01 11:45:52.181	\N
9acf4d2e-9fef-4172-a247-24d73b3345ee	Fabiana Lopes de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.183	2026-09-01 11:45:52.183	\N
a45da8cb-8656-4830-b982-44acfa25af03	Taila Lindner Carvalho	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.186	2026-09-01 11:45:52.186	\N
10376b0b-7e90-47c6-8583-7823f04349a0	Kelly da Silva Pereira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.187	2026-09-01 11:45:52.187	\N
a4354b9c-3835-4747-bdb5-3b78bf8046aa	Eduarda Carvalho Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.188	2026-09-01 11:45:52.188	\N
a65ce956-caf6-4e87-ac61-d97b05fe6525	Liliane Marques Freitas	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.153	2026-09-01 12:01:28.903	\N
ae19ec1b-a731-4419-852d-c17a1cfb8257	Deise Leite Marques	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.154	2026-09-01 12:01:28.904	\N
05b90a72-43d0-4991-8516-fe43ff99e66d	Ines Henriques da Costa	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.16	2026-09-01 12:01:28.905	\N
f82218c5-08b1-4301-80a6-3e5504ee25e1	Patricia Abreu Gomes	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.163	2026-09-01 12:01:28.906	\N
e558e16c-f17a-4fc9-8f48-979262dd0472	Carolini Bortoli Anjolin	\N	\N	\N	\N	Departamento: Farmácia UTI	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.167	2026-09-01 12:01:28.908	\N
f6ec3ffa-9358-459b-a1f0-fc46b3279b3e	Douglas Pinto dos Santos	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.168	2026-09-01 12:01:28.909	\N
f7a0023a-c8cb-47d9-b359-849edcf6ae35	Daiane Vaz dos Santos	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.169	2026-09-01 12:01:28.911	\N
85922212-7ac0-4906-9924-267457d47fbb	Luciane Flores Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.176	2026-09-01 12:01:28.913	\N
34d0f50f-9fad-40bb-9e3f-355cea89ee58	Leandro Noronha de Souza	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.177	2026-09-01 12:01:28.915	\N
ac4c33bc-920e-4779-8132-e98f69f4985a	Paula Chananeco de Souza	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.182	2026-09-01 12:01:28.916	\N
edfcbec6-96ec-4fe0-b6d6-e75e77123739	Cristiane Rebello Franco	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.185	2026-09-01 12:01:28.917	\N
448d72ce-3790-4076-be1b-bee787d15b7c	Raissa Santos da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.191	2026-09-01 11:45:52.191	\N
77890774-1b6c-412c-98d8-5515abf53c7a	Andreia Karolczak Holz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.192	2026-09-01 11:45:52.192	\N
7a576d28-4028-4815-95c3-142128ecdcfd	Barbara Ramos da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.196	2026-09-01 11:45:52.196	\N
8ca81e6f-178c-4ffd-84f3-481ceacc1c96	Evelyn Santos da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.198	2026-09-01 11:45:52.198	\N
3ae1bc7c-eeeb-4523-bca7-34cfcd2d7220	Patricia Dittberner Boeira	\N	\N	\N	\N	Departamento: Eletro	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.2	2026-09-01 11:45:52.2	\N
c37f0eaa-93c8-4015-8638-4b173866a5c6	Tamires da Rocha Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.201	2026-09-01 11:45:52.201	\N
0e82f887-1798-4e7c-8f12-b56a5e9faba3	Jordana Araujo de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.203	2026-09-01 11:45:52.203	\N
8cb63ff5-717f-48e7-bfa7-4614b6aa8377	Magda da Silva Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.205	2026-09-01 11:45:52.205	\N
c13509f3-a3e7-4b54-b8fa-6fdd801501e4	Raisa de Souza Bierhals	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.207	2026-09-01 11:45:52.207	\N
20c62f93-c248-44d1-a13d-e3108ab64b99	Marilene de Souza Abreu	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.216	2026-09-01 11:45:52.216	\N
23e3caf2-dc93-46b3-a380-461ca068c5b7	Priscila da Silva Alves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.217	2026-09-01 11:45:52.217	\N
0281bb13-2fc5-4dec-ac55-bb9af6287989	Vilma Souza de Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.219	2026-09-01 11:45:52.219	\N
5cdb9768-03d3-444e-ad7b-924f9e4094fb	Édllyn Samantha Schultz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.222	2026-09-01 11:45:52.222	\N
f4a29328-cf2c-458d-b4f6-aaeff3c5afca	Amanda Pereira da Costa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.223	2026-09-01 11:45:52.223	\N
34ea3e20-e86f-45fe-9052-d8d3cc58e497	Paula Elisangela Araujo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.224	2026-09-01 11:45:52.224	\N
5e773dfb-3f04-46f1-94a7-9ead4ab19623	Marilucia Souza da Cruz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.227	2026-09-01 11:45:52.227	\N
4ff70b4e-f930-4bb8-acb1-ea4e1898ad8c	Jaine Kubiczewski	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.193	2026-09-01 12:01:28.92	\N
3a4be434-2e71-4197-bce8-05dc9a5773e5	Anaina Silva de Oliveira	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.194	2026-09-01 12:01:28.921	\N
a7e1fcad-f5af-4f16-8241-6f58a9a71683	Tamires Marques da Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.195	2026-09-01 12:01:28.922	\N
d0334fbc-b766-4598-9ff1-552fe6c95d06	Jamilson Luis de Almeida	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.199	2026-09-01 12:01:28.923	\N
bec1d92d-e7e7-41c5-89f0-1b505910bf29	Andreia de Souza Azeredo	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.202	2026-09-01 12:01:28.924	\N
49f40587-7382-4033-ae80-7592b71d2152	Valeria Govoni de Azevedo	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.204	2026-09-01 12:01:28.925	\N
5218826d-e5ec-46ce-be7f-79ac48c483a7	Angelita da Rosa Oliveira	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.206	2026-09-01 12:01:28.926	\N
73ebdbb2-9f67-41c3-a8a2-cf05ecbdb4fd	Rejane Maria Conterato	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.208	2026-09-01 12:01:28.927	\N
daf957ce-9f01-4d68-9577-711bbd1f365c	Geison Rodrigues Leao	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.21	2026-09-01 12:01:28.929	\N
8e22f5dc-7c38-40bc-b38e-3f2a14128e9e	Giovana Maia da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.211	2026-09-01 12:01:28.93	\N
e6187357-4222-43f9-8085-95bd1371c4eb	Liorene da Silva Lima	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.212	2026-09-01 12:01:28.931	\N
fcbaa7a4-bb78-40fa-b751-e73cf9ec884e	Tamires Nogueira Souza	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.213	2026-09-01 12:01:28.933	\N
93c20591-6eb5-4756-a041-8435cc5661a8	Maria Rita Silva de Souza	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.214	2026-09-01 12:01:28.934	\N
3357ab0f-563e-41d9-85ea-be3f5e0d0f01	Andreia de Azeredo	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.22	2026-09-01 12:01:28.935	\N
c9015f34-babb-4acd-ab3f-db318bc66b55	Eduardo Andrades de Sousa	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.221	2026-09-01 12:01:28.936	\N
53c28799-08c5-4f18-94b6-b44426c2b391	Taila Matias Franciozi	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.225	2026-09-01 12:01:28.937	\N
ceac1b94-9b67-4617-a9f8-ea5f2a46c5ff	Rosimar da Silva Ferreira	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.226	2026-09-01 12:01:28.938	\N
118b0577-3654-4324-a549-ee7505480f9c	Vittoria Tavares Ferraz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.233	2026-09-01 11:45:52.233	\N
a0d5c5a0-ffae-4af2-a925-d782c24a9d62	Fernanda de Souza Lopes	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.234	2026-09-01 11:45:52.234	\N
59c0bcbc-0301-4774-a180-b64c33681f32	Carmem Luciana Patrikus	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.237	2026-09-01 11:45:52.237	\N
dd17cf7b-8638-42c6-8e8f-e0b70faf08e9	Eduarda Jacoby da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.238	2026-09-01 11:45:52.238	\N
a15c39e2-0d61-4c78-9c05-4a31e27c0822	Jessica Rossatto Cosenza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.239	2026-09-01 11:45:52.239	\N
64d98e24-0915-47c0-8c4c-2ce6a4420400	Amanda Caroline de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.241	2026-09-01 11:45:52.241	\N
02467423-70d6-44c3-b13a-88776bec0691	Milena de Freitas Flores	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.242	2026-09-01 11:45:52.242	\N
66a923af-fc81-4fef-8e77-9d986f5a80bd	Juliane Souza dos Passos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.245	2026-09-01 11:45:52.245	\N
caf8ca6f-43b7-41b4-9da2-e32eaf169779	Claudia Moraes Michelsen	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.25	2026-09-01 11:45:52.25	\N
4310ea36-b7c6-49f1-b723-b6baf2130cb2	Janaina Almeida Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.252	2026-09-01 11:45:52.252	\N
de643de1-182c-4904-ac11-73e7f926fc39	Franciele Fries Siqueira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.254	2026-09-01 11:45:52.254	\N
4a5170b0-feec-48f1-8b4e-bd6a6873e1b0	Fabio Augusto dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.256	2026-09-01 11:45:52.256	\N
e09a4e33-0c69-45da-9487-359b3135b95f	Luciane de Souza Hellwig	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.257	2026-09-01 11:45:52.257	\N
1bf050ae-e607-414a-8cc0-fe3a0dc60dff	Paloma Amengual De Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.258	2026-09-01 11:45:52.258	\N
57bac204-a825-47b7-a1ba-c45e9d46b9e9	Eduarda Gonzalez Neumann	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.26	2026-09-01 11:45:52.26	\N
ffb9a773-a2e8-4cdb-9571-24b7f2859e7e	Carolina da Silva Araujo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.261	2026-09-01 11:45:52.261	\N
3b7cf1b0-f50e-4030-8726-507da5f76b62	Natalia Andrade da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.262	2026-09-01 11:45:52.262	\N
0572f45d-d9dd-4f29-b610-ac23e6257078	Mariane Coutinho Andrade	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.267	2026-09-01 11:45:52.267	\N
6767e75e-6aad-4345-bda9-f1dabd15269e	Fabiana Silva da Fonseca	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.268	2026-09-01 11:45:52.268	\N
a6115d50-896f-41b2-a164-a56a19462b94	Suelen Rodrigues da Silva	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.23	2026-09-01 12:01:28.94	\N
fd9da0f8-fd51-48b1-b869-ccfd7b9d11b1	Rosana Silva da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.235	2026-09-01 12:01:28.942	\N
b15b46af-edc0-4d9e-aa7c-646c0ac5f732	Gilberto Santana Maia	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.236	2026-09-01 12:01:28.946	\N
b995c59e-37d1-4a13-b3a9-de627039757a	Edilon Silveira de Souza	\N	\N	\N	\N	Departamento: Manutenção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.24	2026-09-01 12:01:28.948	\N
6a6d4bdd-8468-436c-976f-4bade4dacfa2	Daniela da Silva Rocha	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.243	2026-09-01 12:01:28.949	\N
dd7d9482-fa6e-4864-b0ca-e676a6d51675	Paulo Roberto de Souza	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.244	2026-09-01 12:01:28.95	\N
8d96efb3-1aa2-40eb-b89c-5f4b6542633c	Juliana Forte da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.246	2026-09-01 12:01:28.952	\N
7190f80a-5b2e-497e-bb90-8de23edb83b0	Fabiane Gonçalves Correa	\N	\N	\N	\N	Departamento: Agência Transfusional	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.247	2026-09-01 12:01:28.953	\N
4a4f1f20-3944-4ae5-8084-5b7866266ef1	Manoela Amaral de Souza	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.253	2026-09-01 12:01:28.954	\N
c5cb97e1-1ac3-4285-86b6-6c08ba97c62e	Vagner Rios de Souza	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.259	2026-09-01 12:01:28.955	\N
f2c5f562-1be1-42a0-bef9-acaa5fdfe2ed	Luciene da Rocha Rosa Reis	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.264	2026-09-01 12:01:28.957	\N
37b3e6b0-c2a6-4118-96e5-2287ab624f8b	Anajara Souza da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.265	2026-09-01 12:01:28.958	\N
07499d49-1f81-41cf-9e09-799d2aacca6f	Marcelo Ferreira Cassali	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.272	2026-09-01 11:45:52.272	\N
d5423b71-a1b6-4511-8406-19b5da5fdcd1	Ana Regina Souza da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.274	2026-09-01 11:45:52.274	\N
6f56e693-a0b1-4ab0-be8c-238e8c6eb777	Carine Soares de Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.278	2026-09-01 11:45:52.278	\N
71c5dedb-7230-4aae-a146-49c70d414a48	Natacha da Silva Dolinski	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.28	2026-09-01 11:45:52.28	\N
b752fc85-5de5-4267-915c-c5c2c245a1d7	Tatiana Laufer dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.281	2026-09-01 11:45:52.281	\N
1860e9c5-df34-4cad-ace7-d40b7043677a	Kailaini Ávila de Alencar	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.283	2026-09-01 11:45:52.283	\N
d0442cf9-7b50-4c24-bdfa-43b92f6132a1	Ana Julia Classen Tolotti	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.286	2026-09-01 11:45:52.286	\N
35217139-01a4-48cd-8ca2-262791982106	Marines Pinheiro da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.288	2026-09-01 11:45:52.288	\N
0fde3747-067c-4c0b-a42c-7596c23b9a5e	Natalia Pacheco Gonçalves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.289	2026-09-01 11:45:52.289	\N
fc48a142-bed9-4dbe-a2cf-2485740fb70c	Larissa de Oliveira Alves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.29	2026-09-01 11:45:52.29	\N
2f9aa492-3fa3-4d9e-b090-cd2fae50cb59	Kemillyn da Silva Sanches	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.291	2026-09-01 11:45:52.291	\N
45ac2d96-d39c-48f1-8fe7-236f6fb602f4	Inajara Tolentino Scienza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.292	2026-09-01 11:45:52.292	\N
e81f8815-4a07-4356-810d-b5fff2002cca	Natalia dos Santos Martin	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.293	2026-09-01 11:45:52.293	\N
6f5f1295-9405-4723-809f-d59178916efe	Elisangela da Rosa Brasil	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.295	2026-09-01 11:45:52.295	\N
1a3f8253-0d11-4e19-a77b-b8797cf44d95	Janaina de Abreu Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.296	2026-09-01 11:45:52.296	\N
90f34c5e-a5a4-471c-9615-49d3be2e564e	Simone Heningues de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.299	2026-09-01 11:45:52.299	\N
9dcdff43-9a0b-4062-ad4b-2e55afae58d7	Ritieli Britto dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.3	2026-09-01 11:45:52.3	\N
2d0d8d8c-aafa-4d77-beb6-4e58dacafc5e	Rosana Quadros de Freitas	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.301	2026-09-01 11:45:52.301	\N
c18a729b-b68e-473f-8717-f9893134a76c	Isadora Damaceno da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.302	2026-09-01 11:45:52.302	\N
0b81765e-9998-457e-89a7-01da3fc50392	Elis Regina Rocha Gularte	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.303	2026-09-01 11:45:52.303	\N
1917f47f-89ae-4e35-9f4d-3f87d0f98517	Angelica Sant Anna Gimenes	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.271	2026-09-01 12:01:28.96	\N
50b2c123-3e66-4a9a-9b2c-269f37c918c0	Rosane Nunes de Azevedo	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.273	2026-09-01 12:01:28.961	\N
4403c461-5a17-478e-a827-7672a2cd16bb	Fernanda Rocha da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.275	2026-09-01 12:01:28.962	\N
5b1e9386-bb80-43b8-86ca-43fb8f6628b6	Irys Marly Ribeiro de Sousa	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.276	2026-09-01 12:01:28.964	\N
b5ac4e9f-5c83-40b1-9036-944477f2514c	Marcos da Silva Azevedo	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.277	2026-09-01 12:01:28.965	\N
ef1e6f5f-b61e-4e24-933a-ccd38b123aa7	Juliana da Silva Ferrão	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.282	2026-09-01 12:01:28.966	\N
03dabf24-57f2-4178-aaeb-e76d96797c28	Jessica Rodrigues Correa	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.284	2026-09-01 12:01:28.967	\N
a7508960-a418-460b-a4e1-b780006fe5aa	Daiana Goularte Marques	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.285	2026-09-01 12:01:28.968	\N
3ba1061f-130c-47f4-ad08-b1d30f5ef53d	Rene Azambuja Castro	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.294	2026-09-01 12:01:28.969	\N
b21c9ce4-f9e7-4e87-b933-a4fa5f5d8a60	Susana de Melo Ferreira	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.297	2026-09-01 12:01:28.97	\N
1beaa6a9-82cb-4530-b34d-83f49070e883	Ariana de Araujo Sampaio	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.304	2026-09-01 12:01:28.971	\N
8f0bd53d-a68a-44be-934b-758f71082ce2	Graziela da Silva Rocha	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.305	2026-09-01 12:01:28.972	\N
9d46f2b4-915c-440f-a547-f23aac8692fb	Vitoria Caroline Liziardi	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.313	2026-09-01 11:45:52.313	\N
35cabe33-7cbb-4548-817f-0ed22c5fc7f6	Cristiane Anjolim Carvalho	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.315	2026-09-01 11:45:52.315	\N
7f705d75-fe52-4e06-9773-fadb4d153824	Tatiane da Silva Goncalves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.316	2026-09-01 11:45:52.316	\N
6dcbb84e-4986-4254-80eb-882de2b0787f	Ana Paula Schornes Pereira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.323	2026-09-01 11:45:52.323	\N
5890695e-ce2a-4d60-97d6-5509e3f128cc	Jessica Angel Boeira Nunes	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.324	2026-09-01 11:45:52.324	\N
805ebbc9-0ee0-41fc-b08a-e78bcb57cab0	Jessica Figueiro de Lima	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.325	2026-09-01 11:45:52.325	\N
2b95e937-a2d3-4c13-8d32-ebed0d65187e	Vanessa Nascimento Azeredo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.328	2026-09-01 11:45:52.328	\N
4534631a-c673-4d8f-b22c-dde9ec4d2ff5	Maria Loeci Ferreira Nascime	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.33	2026-09-01 11:45:52.33	\N
f9678885-a446-48ee-a56d-9a703f87cd6f	Danieli de Barros de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.338	2026-09-01 11:45:52.338	\N
f19ced62-144b-49e3-8fe5-0b50ecda0fa4	Cristiane Silva dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.342	2026-09-01 11:45:52.342	\N
51042d05-d698-4fd6-a029-ba03a318109c	Claudia Ivonete Silva Nunes	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.307	2026-09-01 12:01:28.975	\N
2f441fe3-f89f-452b-aa0d-a31da9b39ae6	Cristiana Cavalheiro Santos	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.309	2026-09-01 12:01:28.976	\N
e6d4480d-6789-4d33-adf9-28c501ced38e	Jovani da Silva Gelinskiv	\N	\N	\N	\N	Departamento: Manutenção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.31	2026-09-01 12:01:28.977	\N
a3b30777-156c-4098-b7bf-9faed89c030f	Graziella Vieira Nascimento	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.312	2026-09-01 12:01:28.978	\N
1eaf1667-1340-4711-84af-1a1917f25c73	Carina Laufer dos Santos	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.317	2026-09-01 12:01:28.979	\N
39271468-4794-4c27-9598-e871c0347b57	Larissa de Oliveira Ferreira	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.318	2026-09-01 12:01:28.981	\N
bb115926-7342-41fb-a182-222b7a090edd	Simone da Silva Alves	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.32	2026-09-01 12:01:28.982	\N
c9e57121-c4da-4e38-b28e-5948bce6ba28	Rosilda Marques Santos Souza	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.321	2026-09-01 12:01:28.984	\N
b9a38d78-3194-4d9d-9b3e-59f55f988be2	Ana Lucia Abreu de Abreu	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.326	2026-09-01 12:01:28.986	\N
feb926d6-2295-46ed-96ef-396e3ea3b82a	Jean Ederson Chimendes Silva	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.327	2026-09-01 12:01:28.987	\N
a660b944-7075-4102-b06e-9e95b02ad7c2	Tais Tatiane Silveira Teixei	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.331	2026-09-01 12:01:28.988	\N
3b50a3ef-beb2-40aa-b391-688061cba351	Israel Oliveira Gomes	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.332	2026-09-01 12:01:28.989	\N
9170b1e7-aadd-493a-811e-9fb3ce000674	Cintia Porto da Silva	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.333	2026-09-01 12:01:28.991	\N
9789c65d-b3b1-4aca-85c8-89dd201be8b4	Carla Daniela da Silva Leott	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.334	2026-09-01 12:01:28.992	\N
b8d54071-ac7d-4f85-a0b1-c4a571004df4	Alexandra Silva Coutinho	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.336	2026-09-01 12:01:28.993	\N
8ec2213f-d54f-4b5c-b17c-07e380206b4f	Flavia Andrades de Sousa	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.337	2026-09-01 12:01:28.994	\N
e8ca6635-5a9e-44d5-9282-c1fecd011b9f	Cristiane Barreto Lisboa	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.339	2026-09-01 12:01:28.995	\N
e70b0afe-fbd3-418b-bbcb-0477a0a6592d	Daniel Borba Bragança	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.34	2026-09-01 12:01:28.996	\N
329eece7-1b42-45a9-9d82-d40750e8af40	Gisele Moura de Souza	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.341	2026-09-01 12:01:28.997	\N
de51b8a7-d338-4856-823b-a4055f51469f	Paula Graziele Ribeiro Steigleder	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.343	2026-09-01 12:01:28.998	\N
4dbb74fc-156f-4ed1-a022-23e6426a747f	Diovana Maria Godoy Fenalti	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.355	2026-09-01 11:45:52.355	\N
3872adc2-a233-46a4-aba2-660d0d3bdff9	Jeniffer de Vargas Ferreira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.356	2026-09-01 11:45:52.356	\N
935544ab-3465-44c8-896b-391811542c18	Andrea Rodrigues de Freitas	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.357	2026-09-01 11:45:52.357	\N
29551f47-98f6-4aca-9a05-f4e3048e569a	Luísa Helena Ferreira Nunes	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.36	2026-09-01 11:45:52.36	\N
cacb3aeb-fc0e-4a81-9b50-8071a3d55e70	Shaira Cintia Avila e Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.361	2026-09-01 11:45:52.361	\N
0db539a8-0658-4f4d-bcf6-d74e9ef9946f	Marina Alexsandra Rodrigues	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.364	2026-09-01 11:45:52.364	\N
8825c55b-81df-44d3-8b1d-2d3065880638	Nayara Américo de Melo Cunha	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.366	2026-09-01 11:45:52.366	\N
5d5d36d3-22e3-4cea-a06d-b5d823a36f08	Cleia Patricia Souza Marques	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.367	2026-09-01 11:45:52.367	\N
ddf50c2e-bea8-4fd0-ae38-fee0bc51ed2f	Elisa Lopes Bortoli da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.368	2026-09-01 11:45:52.368	\N
ac950f9d-70d9-40f3-b770-65c62464071a	Rita Graziele Alterman Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.369	2026-09-01 11:45:52.369	\N
1f20d6fb-8b79-4d5a-8cbd-bf402c2ae8bb	Tairine Silveira da Silveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.37	2026-09-01 11:45:52.37	\N
3c2691fb-11cf-4e09-b0f7-6f7625cd7357	Julia Leandra Braga da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.371	2026-09-01 11:45:52.371	\N
a7ad708f-4ddd-4b06-a94e-3f0208d5eee8	Claudia Beatriz da Silva Vaz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.372	2026-09-01 11:45:52.372	\N
79c5ccbd-dad1-471d-92cc-ebd70dc3481c	Angelina de Abreu Campos	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.345	2026-09-01 12:01:29	\N
e9e465ae-80de-4df7-ab88-ef21dd17c327	Deise Graziele Campos	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.346	2026-09-01 12:01:29.001	\N
f9cbbb37-189e-4aaf-8c80-c5cf55280172	Carmem Lucia Pinheiro	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.348	2026-09-01 12:01:29.002	\N
933e5c56-9b40-47ba-a679-08c422568620	Veridiana Soares Tavares	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.349	2026-09-01 12:01:29.003	\N
46f6b77f-989a-4a32-907c-9490c18e20cf	Carlos Ubirajara Chaves de Souza	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.351	2026-09-01 12:01:29.004	\N
19fee936-6170-4f66-ab38-41b8e2e1da33	Rita de Cassia da Silva Nunes	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.352	2026-09-01 12:01:29.005	\N
82e9f2e4-79c2-4425-9b0a-c9ed2b3d5bf5	Marilei Marques Silva Melo	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.353	2026-09-01 12:01:29.006	\N
ea5e7177-dac2-45ff-8824-3dd7acaac2bb	Alexandra Duarte Rocha	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.358	2026-09-01 12:01:29.007	\N
91745bf7-3792-48bf-bd98-f2e8e684130d	Fabiana Marinho Garcia	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.359	2026-09-01 12:01:29.008	\N
5191e588-be29-4a2c-ad74-c6d2f1b0d7eb	Eva Regina Terra da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.362	2026-09-01 12:01:29.009	\N
72e07f8d-425f-4ef8-95a6-fcf28cea700a	Mari Ines Teixeira Lindner	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.373	2026-09-01 12:01:29.012	\N
d639189e-38ee-47ea-b0ab-8dcf0b41039b	Daniela Moura Camboim	\N	\N	\N	\N	Departamento: Controle de Infecção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.375	2026-09-01 12:01:29.014	\N
98d4eace-90aa-4b31-851b-8db4c2feab6e	Juliana Oliveira Rodrigues	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.376	2026-09-01 12:01:29.015	\N
679f8dc6-ea9b-46d6-94a8-c3c9b9c5f156	Francine Ramos da Silva	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.377	2026-09-01 12:01:29.017	\N
6769f1c9-5a8d-4389-92cf-7ebbaa68eaad	Michele Ferreira de Barros	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.378	2026-09-01 12:01:29.018	\N
2e00b4ba-c5a1-4ea6-b742-1edfe704a416	Teresa Cristina Martins	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.379	2026-09-01 12:01:29.019	\N
bd10c914-e406-4d7a-b1fc-178a5b3039d3	Daniel de Souza Santana	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.365	2026-09-01 15:03:54.512	\N
00fafa17-89a1-42ca-9d9c-d3af1baa87d4	Daiana da Silva Michael Luiz	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.383	2026-09-01 11:45:52.383	\N
cec8d853-b3d3-421c-a239-b2bcfe730729	Droanle Canael Machado Costa	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.385	2026-09-01 11:45:52.385	\N
1be70ec4-1e84-4672-98c5-104c8f0b611a	Yngryd Yasmym Serpa Gonçalves	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.389	2026-09-01 11:45:52.389	\N
6fdd8068-8376-4b4d-aa7d-89689dd6871a	Kamily de Bortoli da Silveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.391	2026-09-01 11:45:52.391	\N
fd558057-18e3-49a2-a003-8011741b8827	Jessica Lopes Correia Batista	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.395	2026-09-01 11:45:52.395	\N
735d58c2-cd07-4d8d-901f-75b1379b0427	Carlos Vinicius Cruz da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.398	2026-09-01 11:45:52.398	\N
6bd518f4-5983-4ac3-8345-e0559d01a106	Larissa Kerlly Costa Pinheiro	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.4	2026-09-01 11:45:52.4	\N
2337c70d-0145-46f8-a011-0ad54a730a17	Karla Rozane de Almeida Avila	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.405	2026-09-01 11:45:52.405	\N
1a814aeb-5025-4178-b8b8-d8ac1e365009	Nara Angelita da Silva Vieira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.407	2026-09-01 11:45:52.407	\N
9d4852c5-c701-4972-8372-32248228b4e4	Elaine Patricia Costa da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.409	2026-09-01 11:45:52.409	\N
6f8fd334-14bb-4b56-85b0-682ad7985725	Talia Isaura de Castro Selback	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.419	2026-09-01 11:45:52.419	\N
e88e1066-d020-4fe5-abc5-060034b23518	Rochele Correia Caminha	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.382	2026-09-01 12:01:29.021	\N
70b9fb31-35a0-4a1b-9189-7b50132ac3fa	Ariane Fernanda Silva da Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.384	2026-09-01 12:01:29.022	\N
4480d359-d2b7-44fe-b564-e21108610dfc	Vanessa Shirley Anjolin	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.386	2026-09-01 12:01:29.023	\N
ececdeeb-8b42-46c2-ae3b-2d5eccf2675c	Marisa Avila da Silva Gobe	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.387	2026-09-01 12:01:29.024	\N
c32b0a9a-dbcd-4a27-8a3f-c06c5b9794de	Wagner Anderson de Oliveira	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.388	2026-09-01 12:01:29.025	\N
839712b8-0182-4072-a736-ff957e1fd920	Lucca Camargo Ferreira de Souza	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.39	2026-09-01 12:01:29.026	\N
4d4d2010-d9de-458b-98dc-a0fe11e0ce3f	Silas Leandro Nunes Albuquerque	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.393	2026-09-01 12:01:29.027	\N
07d86378-7be8-43e6-b09d-7389bd1f88fc	Sulene dos Santos Vargas	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.394	2026-09-01 12:01:29.029	\N
372251e9-83a5-4bd7-9d99-8940c8641922	Maria Eduarda da Rosa Castilhos	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.397	2026-09-01 12:01:29.03	\N
dd5dcc73-dc31-4613-bb2a-80e0bb032c96	Elisabete da Silva Ferreira	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.401	2026-09-01 12:01:29.031	\N
b66182e0-b3ae-40bf-bbaa-cd229babca38	Andressa Duarte de Souza	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.402	2026-09-01 12:01:29.032	\N
71ae05c7-6802-41b9-8bda-c6eba135d8d0	Gislaine de Souza Francisco	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.403	2026-09-01 12:01:29.033	\N
d51fcc49-7312-4f4d-ab5a-2585dca234a9	Beatriz de Andrades Tavares	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.404	2026-09-01 12:01:29.034	\N
30b9cf01-ea6a-459a-894c-442ef0d81101	Giane Maria da Silva Farias	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.406	2026-09-01 12:01:29.035	\N
3d644ca2-a511-42c5-a10a-b11a5080c710	Maristela Chananeco Azi Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.408	2026-09-01 12:01:29.036	\N
a2e50804-cb1f-409f-8907-1065047d4009	Catia Regina Rodrigues Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.41	2026-09-01 12:01:29.037	\N
f78a6d8c-2d4f-4130-9c11-9d7b9af39235	Leticia Flores de Oliveira Souza	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.411	2026-09-01 12:01:29.038	\N
a9b1eb19-536f-46cd-adef-9158253cb92c	Vera Cristina Rebello Franco	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.413	2026-09-01 12:01:29.039	\N
4f936432-61ac-4299-8eda-a993b49adc58	Rosicler de Souza Padilha	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.414	2026-09-01 12:01:29.04	\N
f076c00f-205b-4c52-9dd6-4338aec8c3b3	Maria Antonia Silva Azambuja	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.416	2026-09-01 12:01:29.041	\N
257c05cf-5cf4-4b1c-ae39-61e2ca1d4550	Marlene da Silva Nogueira	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.418	2026-09-01 12:01:29.042	\N
d2f47fbe-eab0-4c50-9175-a528160ab092	Maria Graziela de Lima Teixeira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.425	2026-09-01 11:45:52.425	\N
330c3523-4ab0-4ffa-9a7d-1c02b2ec69dc	Tais Virginia de Castro Selback	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.427	2026-09-01 11:45:52.427	\N
f38ab4a1-1590-49ed-bd5d-cc0f8a211efc	Ellen Vitoria Nogueira Longaray	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.43	2026-09-01 11:45:52.43	\N
58a91e79-0182-4ec6-839d-094e4ad36190	Gabrielly Barcena do Nascimento	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.436	2026-09-01 11:45:52.436	\N
46620e7f-b1d5-4aed-9ba2-91f2d26dc9c5	Maria Cristina Silva de Freitas	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.438	2026-09-01 11:45:52.438	\N
1ecc48c3-28c0-49dc-89d8-c1a6de04246f	Cindi Alexandra Teixeira Botelho	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.439	2026-09-01 11:45:52.439	\N
da117f1f-688d-4cb4-acc3-1f9b7633cfe7	Francieli Silva Souza de Bortoli	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.441	2026-09-01 11:45:52.441	\N
5076956e-98b7-42f9-a825-009bde0df419	Carla Cristiane de Souza e Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.442	2026-09-01 11:45:52.442	\N
26323c86-5fd8-4cb6-bdfb-4c34db53b8ca	Maria Eduarda Vilodre dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.443	2026-09-01 11:45:52.443	\N
5e39e444-34f3-47f8-8ef3-74bd793ffb24	Vera Beatriz Psigodinski Brinques	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.446	2026-09-01 11:45:52.446	\N
5c572c1f-a064-4ae6-8f1a-577ddaaaf4da	Keli Regina Brum da Silva Marocco	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.448	2026-09-01 11:45:52.448	\N
2d616d73-3bf2-49c2-a0d9-7d6dedef716c	Yares Eduardo Rosa Nunes Da Silveira	\N	\N	\N	\N	Departamento: Arquivo	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.45	2026-09-01 11:45:52.45	\N
eda21756-f23b-45b5-b8d5-cf621e3baac0	Alice Fernanda Guedes da Silveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.453	2026-09-01 11:45:52.453	\N
a799fc8a-8daa-4f79-badb-b61816f27d7a	Eder Fagundes Cunha de Abreu	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.423	2026-09-01 12:01:29.044	\N
996bb2ca-451f-438a-9eb4-2aa2be4204a4	Caroline Pereira da Silva Soares	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.424	2026-09-01 12:01:29.045	\N
27157f1d-f1cc-468c-b65d-06b04f58639b	Carla Andressa Kuhn Andressa Kuhn	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.426	2026-09-01 12:01:29.046	\N
fdc585dd-ce06-4eca-861f-c5d16b8bbe0c	Lizandra Fernandes Pereira	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.428	2026-09-01 12:01:29.047	\N
fd51366f-ae37-4eab-98e3-309d053717f4	Elisangela Medeiros Grassotti	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.429	2026-09-01 12:01:29.049	\N
13b17bbf-cbcf-4d6e-ae72-f998469d23e2	Daiane Coutinho Meneghetti	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.431	2026-09-01 12:01:29.05	\N
cf437993-9a17-42ae-8119-825b753833bf	Dominique de Oliveira Marques	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.433	2026-09-01 12:01:29.051	\N
592c358d-1418-48fd-9a42-42b87d4eaeb0	Cristiane Pereira Armborst	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.434	2026-09-01 12:01:29.052	\N
25a7c5cf-84e1-47ba-9448-dab55d9df1df	Vanderson Zacharias Gonçalves	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.435	2026-09-01 12:01:29.053	\N
b5bc4b3f-b67e-426a-b5d6-0847093cbfa2	Maris Roseli Marques da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.437	2026-09-01 12:01:29.054	\N
1f39b860-6c64-42ec-9c60-53ba558120f5	Viviana Silveira de Oliveira	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.44	2026-09-01 12:01:29.055	\N
a0562865-6b0e-4b78-b51a-3f8db90cf5dd	Richele Luz Figueiredo da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.444	2026-09-01 12:01:29.056	\N
b6efa4e2-c964-425c-8307-fbb2e2274b22	Jenifer Camila Marques da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.445	2026-09-01 12:01:29.057	\N
6a4d7eea-b784-4f11-88b8-14ec3c68537d	Vanessa de Oliveira Teixeira	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.447	2026-09-01 12:01:29.058	\N
0a6e0904-0f54-49ea-98aa-28691825bd48	Iara Teresinha Duarte Pereira	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.449	2026-09-01 12:01:29.059	\N
c38e9ed8-979c-4a85-b156-7f201ac1dee4	Rosa Maria Duarte dos Santos	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.452	2026-09-01 12:01:29.061	\N
c46222c7-d511-439f-a239-98aaff03ba0e	Cassia Madalena Moraes Cruz da Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.454	2026-09-01 12:01:29.062	\N
2e31fdcb-7853-4299-92a1-7faf79ff70e1	Cintia Azevedo Peretti de Carvalho	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.46	2026-09-01 11:45:52.46	\N
3c911e3f-2b5b-4f4e-813a-6285feb9523b	Marcela Alessandra Gomes G de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.462	2026-09-01 11:45:52.462	\N
0453033b-0756-4525-aeb7-f884ffa841da	Sabrina Rodrigues de Castro	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.466	2026-09-01 11:45:52.466	\N
c635862a-ccf1-4685-9111-8ace066c5c0d	Daiane Fusieger Rodrigues dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.467	2026-09-01 11:45:52.467	\N
2dcef60f-ceaf-4394-8995-216b8be396f2	Elisabeth Freitas Pedroso da Conceicao	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.468	2026-09-01 11:45:52.468	\N
4b749859-fe9b-41b7-b34b-faf1e9d2c6c9	Luisa Cristina Coutinho Severo da Silva	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.469	2026-09-01 11:45:52.469	\N
b309bbcf-9927-41f0-b7dd-d0fefaa96da2	Joice Marques Soares	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.479	2026-09-01 11:45:52.479	\N
5b2804f0-cb19-49ab-95ec-fa0f1050de02	Natalie Souza Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.48	2026-09-01 11:45:52.48	\N
6435395d-8ecc-4a14-86a9-59748b18a9ef	Flávia Alessandra Sarmento	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.482	2026-09-01 11:45:52.482	\N
1d0da181-f0cc-458a-bebe-35dce1ab1303	Fabiane Freire Rodrigues	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.484	2026-09-01 11:45:52.484	\N
6e38d17d-3a2b-443b-b644-ea00fb7018cf	Amanda Fagundes de Souza	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.485	2026-09-01 11:45:52.485	\N
7debd18d-7d77-4577-8a1f-2650097b67ef	Juliana Meira Rodrigues	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.486	2026-09-01 11:45:52.486	\N
ef5d8e8e-8590-4a2c-9a6d-d41f7821859c	Maria Cecília Vieira Machado	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.487	2026-09-01 11:45:52.487	\N
4021e5e6-a3d2-47d7-b1dd-f346f6f62828	Barbara Pereira da Silva Cardoso	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.488	2026-09-01 11:45:52.488	\N
b1a95322-d264-407f-be4b-72ec29a5e14f	Sabrina da Rosa Salatti	\N	\N	\N	\N	Departamento: Agência Transfusional	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.458	2026-09-01 12:01:29.065	\N
21aa30a3-98d0-4ceb-8a19-38665ab0ad71	Janice Cristiane Jacoby da Silva	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.459	2026-09-01 12:01:29.066	\N
63fcdec1-739d-4dc2-9831-e7188c440084	Kamila Eberhardt de Souza Vieira	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.461	2026-09-01 12:01:29.067	\N
6cce6142-20f3-47f4-880a-0881bc91ddb2	Silvia Maria dos Santos Lenzzi	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.463	2026-09-01 12:01:29.068	\N
3c1908c4-56e1-4619-818a-d804e9f61b4b	Sabrina Teresinha de Sa Marques	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.465	2026-09-01 12:01:29.069	\N
c67f0606-40de-494e-9ce4-b2500878d33a	Kelvan Muniz Rocha	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.47	2026-09-01 12:01:29.07	\N
639f1b54-cf06-4213-8e15-7e4a2479cc9e	Bruna Castro de Castro	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.471	2026-09-01 12:01:29.071	\N
e17397fb-5d9e-490a-8835-31e4f66f2cc8	Filipe Aires dos Santos	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.472	2026-09-01 12:01:29.072	\N
db92b2fe-a8f5-48dc-b6ac-34794909dc0e	Victoria de Souza Barth	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.473	2026-09-01 12:01:29.073	\N
5caafc52-d6c2-4520-a989-3bd69ea2ad79	Tais de Azevedo Luedtke	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.474	2026-09-01 12:01:29.074	\N
0c78a025-2418-489c-b0f0-21417ba866f5	Nathalia de Quadros da Silva	\N	\N	\N	\N	Departamento: Faturamento	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.475	2026-09-01 12:01:29.075	\N
b7071a45-7fb0-4534-ace3-e610f95ea86c	Valeria Alves Pereira	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.476	2026-09-01 12:01:29.076	\N
470baa38-47f3-4411-a513-6c718534d266	Gilcara Elisabete Duczinski Fantin	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.477	2026-09-01 12:01:29.077	\N
c4e87461-e8b1-448f-bd47-30403e763c00	Claudia Ferreira da Trindade	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.478	2026-09-01 12:01:29.078	\N
086c255d-6c43-401a-b4d6-c39d1eaa2d56	Manuella de Freitas Marques	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.481	2026-09-01 12:01:29.079	\N
8a5b8dfe-b0c5-4f76-afb9-7012c236d9de	Ester Vitoria de Oliveira Heberle	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.484	2026-09-01 12:01:29.081	\N
16ee978d-98b0-49ea-8b7c-fcd8f6cc6b24	Vanessa Figueiredo Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.493	2026-09-01 11:45:52.493	\N
f066eacc-0920-4cbd-9a47-721ec4e92f09	Miguel da Silva Sant Anna	\N	\N	\N	\N	Departamento: Compras	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.495	2026-09-01 11:45:52.495	\N
7fa7d132-e3be-4b7e-80a3-c3952f18696e	Valéria Lemes Silveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.496	2026-09-01 11:45:52.496	\N
dd034a85-791b-4724-827b-5e6a1b090683	Tiago da Silva Albanus	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.497	2026-09-01 11:45:52.497	\N
f6d5e1bc-c7f6-43d0-a873-09ccd3c656f5	Caroline Moraes Mesquita	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.498	2026-09-01 11:45:52.498	\N
bef391b4-78ee-46eb-9999-97b7db6f6c2d	Elisângela da Silva Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.501	2026-09-01 11:45:52.501	\N
282d3d5a-c9bf-461a-ad52-53e57f6e04f2	Thalia da Silva Duarte	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.503	2026-09-01 11:45:52.503	\N
c2bd5303-ba07-4661-8690-eed602f65be9	Alessandra Faleiro Pereira Daniel	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.504	2026-09-01 11:45:52.504	\N
345ea0fc-241b-4808-b30a-fa27d5ccc157	Carolina Pinheiro Marques	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.508	2026-09-01 11:45:52.508	\N
f42acdd1-0de9-4f46-9fc6-434a72ca95ee	Marilúzia Campos Ferreira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.509	2026-09-01 11:45:52.509	\N
2acff2c2-ab5a-49d1-81d6-88ba57b7d1c4	Luíza Victória de Souza Ambos Delavechia	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.494	2026-09-01 12:01:29.083	\N
d35a5d78-ee55-4ad0-b545-e6b839cdef2a	Denise da Silva Maia	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.5	2026-09-01 12:01:29.084	\N
026b1bd4-63d9-43f7-bd6c-00f3941a608c	Eduarda de Medeiros da Silva	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.502	2026-09-01 12:01:29.085	\N
a0949e47-94f0-4fe6-a59c-23f4e142ac0a	Samanta de Matos da Costa	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.505	2026-09-01 12:01:29.086	\N
f5a739ef-7268-4f59-87e0-8ab9eb87e7be	Diogenes Marques de Lima	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.506	2026-09-01 12:01:29.087	\N
af77c41b-4c10-4794-b537-9f851722aeb8	Jose Fernando Maia do Prado	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.507	2026-09-01 12:01:29.088	\N
b836c1d4-964c-45ad-bf8c-78cbe36c9129	Aline Antônia Menezes da Costa	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.51	2026-09-01 12:01:29.089	\N
d4484882-0ee0-4903-bcbc-2cdad66f5a01	Camila Borges Nelson	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.511	2026-09-01 12:01:29.09	\N
f1aaec02-9872-4d93-8070-187e0f83b9b0	Alana Ambos Freitas	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.512	2026-09-01 12:01:29.091	\N
226a91a1-9b4e-4a8a-867e-3e14e2ced1f6	Alice Angelica Caldeira Quaresma	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.514	2026-09-01 12:01:29.093	\N
7881f3c6-a8b5-4ef7-a4ca-c51c0007283c	Alice Wichrestiuk D Arisbo	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.515	2026-09-01 12:01:29.093	\N
1af34483-f9bf-4ba9-b907-e7e6845954bf	Aline Zanella	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.516	2026-09-01 12:01:29.095	\N
d6a3a109-752d-4995-b83a-48187c216cef	Amanda Pinto Sobrosa Lopes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.517	2026-09-01 12:01:29.096	\N
5de90b39-adc3-450b-af87-b6202ffdb73b	Amanda Vitoria Luciano Gomes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.518	2026-09-01 12:01:29.097	\N
4b68deb6-54b5-4f31-8a7e-d8944aa8162a	Amaury Fernandes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.519	2026-09-01 12:01:29.098	\N
1a7f6654-ee96-455e-a231-0a72e422c86c	Ana Caroline Teixeira Fernandes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.52	2026-09-01 12:01:29.099	\N
52c247fa-c969-4c81-a322-d999701b3e06	Ana Paula de Assis Begnis	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.521	2026-09-01 12:01:29.1	\N
0bcb4cdf-a91a-4f59-9144-a367c15c0700	Ana Paula Schmidt Metzger	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.522	2026-09-01 12:01:29.101	\N
74758185-6eb7-4436-b17e-249569786d9e	Andressa Almeida Abdala	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.523	2026-09-01 12:01:29.102	\N
7582941a-7b84-4135-83d6-4e3042550384	Bernardo Nadal Bortoluzzi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.528	2026-09-01 12:01:29.108	\N
d27c0a49-c0f5-41b2-918d-ed665216c863	Bruna Righ Bisognin	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.529	2026-09-01 12:01:29.109	\N
af079913-5cdf-4bbf-82e0-906f116fc1a3	Camila Ehrenbrink Scheid	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.531	2026-09-01 12:01:29.109	\N
a2cc04ff-8d24-4584-b5d4-7d3bdf2d9ae2	Camila Soares Cogo	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.533	2026-09-01 12:01:29.11	\N
f6933c22-e997-4803-b365-edeaf31f16b2	Carla Berndsen	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.534	2026-09-01 12:01:29.112	\N
1c2a738c-fc66-4ffe-9c58-44923335ed85	Carlos Haygert Pithan	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.536	2026-09-01 12:01:29.114	\N
34f1e39d-ca78-4610-946f-35f6c731a2a3	Carolina Scherer Dornelles	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.537	2026-09-01 12:01:29.115	\N
d1393661-a3fe-4d34-92e6-b27978d3e9bf	Cassiane Serpa e Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.538	2026-09-01 12:01:29.116	\N
9db7e06c-5701-4089-8d4e-847dfc902f79	Cassiano Innocente	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.539	2026-09-01 12:01:29.117	\N
c091ee73-b705-4af4-bb0d-7c583bad8866	Charles Pan	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.54	2026-09-01 12:01:29.119	\N
b23f3e0d-04b6-4f6b-a49e-f66ef37eb08d	Christian de Quadros Chaves	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.541	2026-09-01 12:01:29.12	\N
619a4e6b-c23b-4b5e-9f50-99250bfd6e5b	Cleber Pinto Saffi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.542	2026-09-01 12:01:29.121	\N
739ab17d-25b9-4274-8367-b8fea2398faf	Cristiano Danubio de Lima Alves	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.543	2026-09-01 12:01:29.122	\N
20f9dad6-a55c-48d4-9c6a-dd0a1c18a8f6	Cyrio Gabriel Moojen Nacul Borges Fortes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.544	2026-09-01 12:01:29.123	\N
0476d444-b4cf-4d72-98d9-1484462e46b4	Daisy Lima Pradella	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.545	2026-09-01 12:01:29.124	\N
0bf54f5f-e768-41d3-adab-efb261b0cf74	Damaris Mikaela Balin Dorsdt	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.546	2026-09-01 12:01:29.125	\N
a1526032-5086-43d4-9290-c70da8446353	Daniel de Jesus Oliveira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.547	2026-09-01 12:01:29.126	\N
dc84432d-e7d1-4131-8cff-3ed8e9920300	Debora Vitoria Mendonça Sant Anna	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.55	2026-09-01 12:01:29.128	\N
82e381eb-1da4-4b90-8dc7-375bf279d34a	Deurijane Couto Cavalcante	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.551	2026-09-01 12:01:29.129	\N
4e755a24-80de-4bda-9756-4f4862fa6202	Diego Armando Jimenez Crespo	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.552	2026-09-01 12:01:29.13	\N
d01d8b79-ba46-4895-a9bf-2eb1596a03db	Diego Armando Sanchez Marangado	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.553	2026-09-01 12:01:29.131	\N
6d427648-8611-48c6-a9b1-69c5a381c493	Diego Augustus Pereira Goncalves da Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.554	2026-09-01 12:01:29.132	\N
e9fd4c9f-df04-4d08-b1aa-ab4de6ac6e73	Diego Vasconcellos Dizioli	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.555	2026-09-01 12:01:29.134	\N
8ca9fdca-7761-4497-b282-bde34753a31f	Diogo da Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.556	2026-09-01 12:01:29.135	\N
e7b6d743-78f4-4b3e-be36-2a2c7125565e	Doraisy Perez Laurencio	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.557	2026-09-01 12:01:29.136	\N
bfab2eca-a584-456e-854f-2533e4c2d15b	Douglas Acosta Lemos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.558	2026-09-01 12:01:29.137	\N
6e786b4a-5ff4-48f1-84b8-a3cbb0a9ad65	Dunia Hwas Al Khatib	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.559	2026-09-01 12:01:29.138	\N
3fffdb93-a22c-4d95-88c1-5a111f96fc2c	Emanuelle Bergonsi Vercosa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.561	2026-09-01 12:01:29.14	\N
6c4e112a-d136-41e6-9b4a-ad88b785c761	Enrico Ozorio Giacomeli	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.562	2026-09-01 12:01:29.141	\N
53902c1e-e00a-40e1-8459-68a64399ff44	Everton Janoski	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.564	2026-09-01 12:01:29.142	\N
0a2efb61-d9e8-4831-b466-128a78ab30af	Fabiola Sozo	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.568	2026-09-01 12:01:29.145	\N
1b8c72fa-de77-457c-a335-d66d1dc5f15a	Felipe Costa de Oliveira Marques	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.569	2026-09-01 12:01:29.146	\N
692f1083-d73b-4445-a165-da701c542c79	Felipe Gabriel Abreu Goncalves	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.57	2026-09-01 12:01:29.147	\N
b032ea9c-4186-4dd6-b3ab-d4fd725da99c	Fernanda Fassina	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.571	2026-09-01 12:01:29.148	\N
d22eea58-3e07-4a04-8163-6b5dc1070959	Fernando Gabriel Rodrigues	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.572	2026-09-01 12:01:29.149	\N
b64cff6e-98cc-4c98-a11a-16af6cc592e6	Filipe Wendt Vieira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.573	2026-09-01 12:01:29.15	\N
3b2ef8a3-ed6d-4270-bbd4-ccbd932d5c54	Flavia Pereira Ferreira da Costa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.574	2026-09-01 12:01:29.151	\N
134698bd-d31d-4c0e-8108-42087c5ee13e	Gabriela de Freitas Schmidt	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.575	2026-09-01 12:01:29.152	\N
2910b8b8-96c0-46ff-949a-17bf04fc282d	Gabriela Sanfelice	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.577	2026-09-01 12:01:29.153	\N
5359c434-a09a-4cac-aff2-84d3988d322c	Gabriel Machado da Costa e Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.578	2026-09-01 12:01:29.154	\N
67005280-2497-4b08-baa2-01d2e0d6b0eb	Giovani Mulinari Gmoatton	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.58	2026-09-01 12:01:29.156	\N
9fcf77cc-94f7-488f-a51a-bb4cfc8a1f1d	Gisella Chiara Carpi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.581	2026-09-01 12:01:29.157	\N
1bfd3067-c213-4663-9c6f-ae734e72070f	Guilherme Macena Barreto Junior	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.582	2026-09-01 12:01:29.158	\N
c9a1f017-6cea-4287-9544-312879cc7bf6	Guilherme Nogueira Machado	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.584	2026-09-01 12:01:29.159	\N
a260f4dc-2c93-44a1-8114-4efbe52df3ec	Guillermo Alberto Ortiz Orozco	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.585	2026-09-01 12:01:29.16	\N
5295e711-943d-4881-8d5b-c7e605d6baef	Gustavo Andre Nogueira Argenti	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.586	2026-09-01 12:01:29.161	\N
6f318374-a54f-4340-9f15-72d1ea9afd60	Gustavo Dias Neves	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.587	2026-09-01 12:01:29.162	\N
eca2f0a7-cf52-4e31-8682-3d751494a498	Gustavo Soldatelli Lazzarotto	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.588	2026-09-01 12:01:29.163	\N
04de1b75-352b-4c31-8483-a3818d8a0430	Gutierre Neves de Oliveira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.588	2026-09-01 12:01:29.164	\N
41a483df-44f1-4c00-9189-370133a0f60b	Heloisa Jesse Folgierini	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.59	2026-09-01 12:01:29.165	\N
ec9c9e7b-3568-4910-8b48-247055857f6d	Isadora Conter Andreotti	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.591	2026-09-01 12:01:29.166	\N
a10227a8-379a-42e8-8b3a-cb884fc1cae0	Isadora Witt Bosak	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.592	2026-09-01 12:01:29.168	\N
8bfbdb20-23df-404b-b4c7-b2fa9d832e7f	Israel Jelinek Dihl	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.593	2026-09-01 12:01:29.169	\N
87cfc28c-1a7c-4150-9152-5f883dc9b209	Iury Serra de Melo	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.594	2026-09-01 12:01:29.171	\N
85419e7a-ba53-4e08-b97e-16e52e63f489	Ivandro Vieira Crispim	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.595	2026-09-01 12:01:29.172	\N
84d93321-0539-4450-b534-6f8e89c349f5	Izabelly Lopes Souza	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.596	2026-09-01 12:01:29.173	\N
3565f324-a327-46fb-b2bb-840f0dbf9aa0	Jair Kolling	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.598	2026-09-01 12:01:29.174	\N
4c5259b7-4c90-469b-bbcf-54523f6418d6	Jeanine Marques Ayub	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.599	2026-09-01 12:01:29.175	\N
ae0d0939-4524-4cb4-9029-a9c4660cfaf8	Jeferson Goulart Cerveira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.6	2026-09-01 12:01:29.176	\N
2c809cd4-74a4-4bc9-902d-51cff244c0fe	Joao Gabriel Jacersbacher Passos Oliveira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.601	2026-09-01 12:01:29.177	\N
1c81909a-a2f7-42c0-b448-824b2b421c0f	Joao Paulo Andre Aragon Almanza	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.602	2026-09-01 12:01:29.179	\N
ce948ec3-db58-4e4f-984a-ce9d2c54c389	Joao Paulo Farezin Fortti	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.603	2026-09-01 12:01:29.18	\N
dfb40953-478c-4aea-a643-5bf9e0990e40	Jose Luiz Machado	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.609	2026-09-01 12:01:29.186	\N
3e0a65ec-9efc-4d77-8674-b19eaae59251	Jose Victor Ferreira Lima	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.61	2026-09-01 12:01:29.187	\N
9f9b23ca-5645-4d50-ad84-475424a85f45	Josielle Chaves Granero	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.611	2026-09-01 12:01:29.188	\N
20467af0-7eaa-45d3-b394-0a2dc7fd0da8	Julia Giovanetti Rebischke	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.612	2026-09-01 12:01:29.189	\N
da80e145-e3f6-4d83-adad-40fed7ad9b7b	Juliana Reinaldo Camboim	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.613	2026-09-01 12:01:29.19	\N
63e39d12-8615-4e99-9016-a4f7cfe8c5d1	Juliane Carminati	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.614	2026-09-01 12:01:29.191	\N
10f40106-c9e6-4a95-b4b2-583fd59f1726	Juliano Teixeira Rinaldi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.615	2026-09-01 12:01:29.192	\N
1f46a227-58a9-4eab-a243-72360ea9f80f	Julio Soares Curi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.616	2026-09-01 12:01:29.193	\N
826b6c1b-9217-4043-9f34-1ac29df4b8de	Karen Lizeth Puma Lliguin	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.617	2026-09-01 12:01:29.194	\N
bd3e9018-47fc-4a58-bca3-4134006d8e82	Keven Martins Wrague	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.618	2026-09-01 12:01:29.195	\N
4900fbd3-7e05-4cee-8bfc-379c113d3edd	Larissa Linnette Gonzalez Rodriguez	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.62	2026-09-01 12:01:29.197	\N
308a23c6-e9c9-4db6-9a6f-4116c1e3e6f2	Laura Simon	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.621	2026-09-01 12:01:29.198	\N
0448f4fa-2649-4b62-a86a-7461228ee264	Laura Souza da Costa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.622	2026-09-01 12:01:29.199	\N
c1e94d81-b7cd-41b0-b7d1-bae8e16dfe2e	Leandro dos Santos Lemos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.623	2026-09-01 12:01:29.2	\N
45495d24-f2a8-4cce-9bbe-d18ad5324814	Leonardo de Moura Leal	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.624	2026-09-01 12:01:29.201	\N
7c4720d5-4238-4f86-9015-e3ccf9564841	Leonardo Picolotto	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.625	2026-09-01 12:01:29.202	\N
23b94d52-04e4-439a-acbc-e0c5df7aea4f	Leonardo Santini Pedrosa da Fonseca	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.626	2026-09-01 12:01:29.203	\N
e1c56445-c501-4ff8-a9ca-06a143a531e3	Liliana Martins Jorge	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.627	2026-09-01 12:01:29.204	\N
3415fc5c-0056-49f6-9cd3-78a2bcf85c9e	Luana Maria de Oliveira Presado	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.628	2026-09-01 12:01:29.205	\N
6abb2f22-634a-4f13-b98d-c7384573c629	Lucas Bernardes Miranda	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.629	2026-09-01 12:01:29.206	\N
acff52ec-508b-4fb6-bb26-c08954987ef5	Lucas Lima Verde Santos da Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.63	2026-09-01 12:01:29.207	\N
f09a3c39-d9d3-4009-b755-468f5dcf9e2d	Luciana Longo Ferlin	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.631	2026-09-01 12:01:29.207	\N
073202ed-ea49-4513-a441-0fd0c34a65e3	Luiza Barboza de Souza	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.634	2026-09-01 12:01:29.21	\N
5eed3d6e-147d-4340-9b47-5161930a9bd6	Luiz Amilton Kochhann dos Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.635	2026-09-01 12:01:29.211	\N
a7c89a12-d6f8-409b-95b8-aedc8d6338f8	Luiz Antonio Bertelle Filho	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.636	2026-09-01 12:01:29.212	\N
cb020597-3b38-4fa2-98a0-4f9fbc7dfe59	Luiza Romão Mattiello	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.637	2026-09-01 12:01:29.213	\N
b6aafe47-f4f1-4d95-8fd4-42869e80da9e	Maiquel Andre Teixeira Iora	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.638	2026-09-01 12:01:29.214	\N
ed1214eb-971c-4f06-bb73-983fb1ee018f	Marcos Schwenck	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.639	2026-09-01 12:01:29.215	\N
276c8d8c-8ca6-4852-bb86-67a8def5c600	Marcus Lima Salvalaggio	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.64	2026-09-01 12:01:29.216	\N
3f4234d9-8d0e-4bb7-a2ad-bcad155f26a2	Maria Eduarda Trevisan Rezer	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.641	2026-09-01 12:01:29.217	\N
5ca74c61-8130-4a62-8601-68ab9964131d	Maria Isabel Schreiber	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.642	2026-09-01 12:01:29.218	\N
051518ba-5221-49fb-887d-237aa5696b16	Marina de Campos Brandao	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.643	2026-09-01 12:01:29.219	\N
18cb8c4b-1048-4ce7-8d58-2c470fb7a908	Martina Vitoria Flach Dietrich	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.645	2026-09-01 12:01:29.221	\N
61466847-7391-471f-a17e-53fa64703ec5	Matheus Bolzan Beria	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.646	2026-09-01 12:01:29.222	\N
127afe51-805a-4a3c-8486-f4221a68dc86	Mauricio Cavalcante Paixao	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.647	2026-09-01 12:01:29.223	\N
d2f42fc5-2281-46a8-a4ca-34668eb0266b	Mauricio Jose Graia Nepomuceno	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.648	2026-09-01 12:01:29.224	\N
ddb3e246-6fb4-4085-8dc5-321fdf79d26f	Mauricio Milani	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.649	2026-09-01 12:01:29.225	\N
ead0dc1d-dd57-481d-b8ce-b954332fac0d	Mauro Azeredo Filho	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.65	2026-09-01 12:01:29.226	\N
5019f91b-e918-45e3-9768-42007256cff9	Mauro Ghedini Costa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.651	2026-09-01 12:01:29.227	\N
ed038146-3343-4f26-833e-5df21468d883	Mayara Brentano Almeida	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.652	2026-09-01 12:01:29.228	\N
08f4a844-aada-4fd1-8502-5099532347ff	Mayara Sales Shimoda	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.653	2026-09-01 12:01:29.229	\N
bd7afa08-9f5b-4cc6-80af-fe426e4328f9	Mohamed Anass Bodi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.655	2026-09-01 12:01:29.232	\N
ca5296bc-aab6-4656-940b-ecc4684c3b0a	Morgana Schwingel Machado	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.656	2026-09-01 12:01:29.233	\N
e22551c1-4a16-4693-91d2-512e33192563	Naiara Martins Pereira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.657	2026-09-01 12:01:29.234	\N
ba8faff0-c38a-44b0-b33e-e9fc4be53c26	Natalia Frisene	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.658	2026-09-01 12:01:29.235	\N
e20f88e7-890d-4d8b-b04f-c62c2fbf585a	Natana Werle Rocha	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.659	2026-09-01 12:01:29.235	\N
b57ed5aa-ffcf-4dd7-8d57-2ba9e57121a3	Nathalia Nadal Santos Sperotto	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.659	2026-09-01 12:01:29.236	\N
32ebd165-2e69-40f6-b841-e44b9f87593d	Nayane Fernandes Clivatti	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.66	2026-09-01 12:01:29.237	\N
99dbcde6-8471-4d43-8e48-286c4f8706a3	Nayla Azanki Hatem	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.661	2026-09-01 12:01:29.238	\N
5ab8c489-60c7-42b6-9877-0ee3c19edd80	Nicelene Rosse Pereira Crespo	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.662	2026-09-01 12:01:29.239	\N
04b1b01c-6a04-4c9c-829b-697abff8b2de	Nicolas Endrigo Arpini	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.664	2026-09-01 12:01:29.24	\N
750a4b92-68c2-4fb0-ba64-95b88a652706	Nivaldo Monteiro Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.665	2026-09-01 12:01:29.241	\N
455600e8-0d8d-48f6-be23-58fb6acb7f0e	Onassis Boeri de Castro	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.667	2026-09-01 12:01:29.243	\N
bfe0d5c2-b49c-418f-9323-27566a7a414d	Pablo Ribeiro Miranda Barbosa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.669	2026-09-01 12:01:29.244	\N
926ff8b2-a3d0-4b67-bf47-ce532c9961a1	Patricia Tirelli Lena	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.67	2026-09-01 12:01:29.245	\N
35ed1d20-7907-4289-9fd1-d6947648d147	Paulo Afonso Xavier Kuplich	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.672	2026-09-01 12:01:29.246	\N
bb97589c-ffbb-42f0-a036-ca90eb01a019	Paulo Cesar Gonçalves Balaguez	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.673	2026-09-01 12:01:29.247	\N
9998ecd5-d2fb-49dd-b0cf-7eb87fb4aaea	Paulo Ricardo Farsen da Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.675	2026-09-01 12:01:29.248	\N
573ad2dd-3910-4d4d-b0e6-314ce355812d	Paulo Roberto Camacho Custodio	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.676	2026-09-01 12:01:29.249	\N
fb4771be-cf97-4064-b1a7-408ced48afe4	Paulo Roberto Soares Tubino	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.677	2026-09-01 12:01:29.25	\N
20fedaf4-c832-4733-8ffb-bded7dc6363b	Pedro Arend Guazzelli	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.678	2026-09-01 12:01:29.251	\N
d4462cfb-3ee4-47b0-8e7f-32134773fc87	Pedro Dutra Batista	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.679	2026-09-01 12:01:29.252	\N
129b16c0-e225-40b0-871f-1025c8892132	Pedro Henrique Rela Pilati	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.68	2026-09-01 12:01:29.253	\N
7bae8720-f558-4d50-8ea1-50a573496433	Piraju Nicola Neto	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.683	2026-09-01 12:01:29.255	\N
b05b93b6-b6bb-4f07-98a0-af630044f857	Rafaela Dias Barbosa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.687	2026-09-01 12:01:29.259	\N
9f48e519-e5ff-4856-818f-f5fb42402734	Rafaela Mafaciolli Grando	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.688	2026-09-01 12:01:29.26	\N
2e60ba68-0806-446f-96d4-ef09f8367173	Rafaela Maria Klein dos Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.689	2026-09-01 12:01:29.261	\N
05324371-a07c-40f2-9c22-e265494b9441	Rafaela Winck de Carvalho	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.69	2026-09-01 12:01:29.262	\N
f491d3db-3da0-4425-a6cc-545818755a43	Rafael de Oliveira Mota	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.691	2026-09-01 12:01:29.263	\N
09f189bb-b5ed-4f7b-a432-1440962194ce	Rafael do Couto Ferrazza	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.692	2026-09-01 12:01:29.264	\N
2bd3dcf5-38b6-43f4-81d6-f02819271323	Rafael Fernando Wunch	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.693	2026-09-01 12:01:29.265	\N
9fe82ea3-9631-4f4f-b832-806b205936d5	Raoli Scheidemantel Wagner	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.694	2026-09-01 12:01:29.266	\N
ababfc82-d3dd-41f8-9bc9-4f2584740e4b	Raphael Bronzato Wink	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.695	2026-09-01 12:01:29.267	\N
a268d563-3943-4869-9207-bb2985525988	Reginaldo de Brito Quintana	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.696	2026-09-01 12:01:29.268	\N
38c5ebdd-fa2b-4a27-8e3d-9b7875dfb8ba	Reinier Gonzales Estrada	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.697	2026-09-01 12:01:29.269	\N
3785b762-d4c0-443b-a0d3-877dd842b632	Renata Celso Mendes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.698	2026-09-01 12:01:29.27	\N
6c44a88e-9647-49a3-a556-2be8eec1022b	Ricardo Lorentz de Oliveira Freitas	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.7	2026-09-01 12:01:29.272	\N
3e28c910-b627-4ba6-8c32-b9e9748dc537	Robson Rodrigues do Nascimento	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.701	2026-09-01 12:01:29.273	\N
8a67e13d-499b-440d-9451-816106e298fb	Rochele Sperandio	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.702	2026-09-01 12:01:29.274	\N
13d42631-4059-483f-861e-26d23253995a	Rodrigo Corcino dos Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.703	2026-09-01 12:01:29.275	\N
e799eae3-dd9e-468f-a93a-bf2e63542e98	Rodrigo da Silva Javorski	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.704	2026-09-01 12:01:29.276	\N
d23996cc-a73e-4e3e-968a-2bdb562ee4eb	Rodrigo Hirsch Machado	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.705	2026-09-01 12:01:29.277	\N
bf61db57-ec83-43c4-ae72-fa1665162fa3	Rodrigo Miranda Custodio	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.706	2026-09-01 12:01:29.278	\N
f475a31d-6e65-493a-8c52-5943a59d5129	Rodrigo Salzano Marchese	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.707	2026-09-01 12:01:29.279	\N
77e00f58-5079-4a90-a643-b05642a3ff8c	Roger Frigotto Hoffmann	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.708	2026-09-01 12:01:29.28	\N
6a4560fa-eea0-42cf-a2a7-efa19c252917	Roger Silva de Zorzi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.709	2026-09-01 12:01:29.281	\N
bb019d1b-7d67-4329-811c-f5ec39d6cfed	Romulo Goncalves Gomes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.711	2026-09-01 12:01:29.283	\N
5b23b0fa-8896-4579-8082-bd797ee9d007	Ronald Arturo Dextre Torres	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.712	2026-09-01 12:01:29.284	\N
d5b22275-ca13-423f-9ea0-7679c00d7c46	Rosendo Almanza Mamani	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.713	2026-09-01 12:01:29.285	\N
7649d895-4d00-4e59-a3d1-e7ed098dfcd2	Erlon Norberto Pilger	\N	\N	\N	\N	Departamento: Manutenção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.714	2026-09-01 12:01:29.286	\N
08504b59-c2d5-4448-be7c-35b685f2a518	Bruno de Brito Lopes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.716	2026-09-01 12:01:29.287	\N
77213475-38f1-44d4-adf3-15e297d4f620	Gilberto Feller	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.717	2026-09-01 12:01:29.288	\N
16b3589f-135d-4dec-abe8-333601cdad0d	Guilherme Doleys Celle	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.718	2026-09-01 12:01:29.289	\N
5d1135a2-a0db-4b03-9b0a-19c74f08cee8	Milton Simon Pires	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.719	2026-09-01 12:01:29.29	\N
eb1ad1e1-fc08-4fe2-9104-d11aebaa7532	Rubens de Souza Junior	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.72	2026-09-01 12:01:29.291	\N
df1d7b11-4990-45d4-82f7-6f036d3454ae	Sabrina Moraes	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.721	2026-09-01 12:01:29.292	\N
99d19e35-08f8-40ef-9fd8-c8369c042454	Samuel da Silva Juliao	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.723	2026-09-01 12:01:29.293	\N
2fba1004-8372-4979-995d-c174472e20bc	Simone Heckler de Lima	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.724	2026-09-01 12:01:29.295	\N
78d02585-79a0-41e2-8868-c1581ccffa38	Stefan Warpechowski Neto	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.725	2026-09-01 12:01:29.296	\N
277f2247-7112-429e-a40a-f0070eb2a3ba	Stephanie Boneira Pretto	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.726	2026-09-01 12:01:29.298	\N
1bca48b6-ad76-4380-bae0-cfccac381d25	Suely Braga Lira Lins	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.727	2026-09-01 12:01:29.299	\N
963ff575-a17a-4ce7-a6e0-e0a24eb40a54	Susana Mayer Moreira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.728	2026-09-01 12:01:29.3	\N
f93a1f7d-c569-44b1-91b7-05ac879f9c9f	Tales Shinji Sawakuchi Minei	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.729	2026-09-01 12:01:29.301	\N
91372e00-3fb6-48f0-9029-9273a9af81ef	Tamie Hatori	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.73	2026-09-01 12:01:29.302	\N
fd74c6fd-0c81-4426-b83a-535f8abd04f0	Tatiana Aparecida Holosback Lima	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.731	2026-09-01 12:01:29.303	\N
51cbf419-0875-4bfb-bd23-727dda194747	Thiago Couto Valle Bomfim de Borborema	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.733	2026-09-01 12:01:29.304	\N
8a5e53ab-e80e-4118-9282-4720948b4a9c	Thiago Talamini de Andrade	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.734	2026-09-01 12:01:29.305	\N
a82b1af9-736d-4d5d-9e00-2b308daf49b0	Tiago Cataldo Breitenbach	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.736	2026-09-01 12:01:29.307	\N
3c851901-2082-4cdb-8d3a-16ece93779ef	Tiene Zingano Hinke	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.737	2026-09-01 12:01:29.308	\N
fa48ba59-8fcc-4830-83fe-ae03dc4a8a4a	Valentina Mostardeiro Lubisco	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.738	2026-09-01 12:01:29.309	\N
63ca28d7-35a2-4aed-a59f-aca8abec7fb1	Valeria Rossato	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.739	2026-09-01 12:01:29.311	\N
c952a436-28f7-417e-840e-8ec57ad7e34f	Valquiria Porto Garcez	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.74	2026-09-01 12:01:29.312	\N
d19b4d1b-b74e-4f92-b805-bf1a53f1952e	Vanessa Santos Cerqueira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.741	2026-09-01 12:01:29.314	\N
d40d6f04-8711-4746-8dca-6fce0758de2e	Vanessa Ten Cate	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.742	2026-09-01 12:01:29.315	\N
ac287fe3-418b-4ae9-bc1d-7c49c63f3b7a	Victoria Bridi Todeschini	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.743	2026-09-01 12:01:29.316	\N
8d6b09ee-c6ec-4fe2-993b-d01c0ae7718f	Virgilio da Rocha Olsen	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.744	2026-09-01 12:01:29.317	\N
53acce42-940d-4b78-a0ca-334c65b30190	Vitoria de Oliveira Damacena	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.745	2026-09-01 12:01:29.318	\N
a4eb52f2-fcd1-4081-8758-a951dd8b3ee9	Vitoria Gorini Raichle	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.746	2026-09-01 12:01:29.319	\N
64db1376-d2e7-49c9-a582-fb1c9b61ee2e	Vitor Ribas Pereira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.748	2026-09-01 12:01:29.321	\N
0691293c-a4d9-4e8a-8491-80d235d3ac8f	Vitor Teixeira de Almeida	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.749	2026-09-01 12:01:29.322	\N
bc372ed1-6c99-4750-abf2-24ca3a874428	Vitor Valadares Rezende	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.75	2026-09-01 12:01:29.323	\N
ceecf7d8-4f50-4d6f-8efe-26548cbb02f5	Yara Rocha da Cruz e Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.751	2026-09-01 12:01:29.324	\N
1efe1446-aac1-4238-b07f-61b1a9cf4ffe	Sabrina Comin Bizotto	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.752	2026-09-01 12:01:29.325	\N
96b6c346-db9c-4056-a04d-ff349735bcc8	Thiago Braga da Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.753	2026-09-01 12:01:29.326	\N
aa3dfc4a-50ef-4590-8bf9-dea9f38030e1	Victor Brana Rivas Filho	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.754	2026-09-01 12:01:29.327	\N
69e9f73a-2317-4ae8-99ec-5968109b8191	Victoria Schmidt Ramos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.755	2026-09-01 12:01:29.328	\N
699c9239-1b99-425c-be72-461a4553e427	Vinicius Lazzari	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.756	2026-09-01 12:01:29.329	\N
c4c6c9e1-fca8-4311-93a8-f6002a2f4182	William Osamu Toda Kisaki	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.757	2026-09-01 12:01:29.33	\N
641aa06a-05ab-4281-a503-2d6d0dc21523	Wanusa Baum dos Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.758	2026-09-01 12:01:29.331	\N
d03e0681-93a2-4862-9f5e-f1ff0b9a337c	Francine Silva Moura	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.759	2026-09-01 11:45:52.759	\N
2dee5d13-14bf-4e5d-92d0-6b6cf05d7056	Maria Joana Blanco Pereira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.76	2026-09-01 11:45:52.76	\N
740b9416-1fce-464d-8ee5-ab2e551c21f8	Liziane Boldrini Tubelo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.767	2026-09-01 11:45:52.767	\N
b24e5844-bf2a-4ee9-be92-5c16fc041482	Barbara Pereira Rosales	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.772	2026-09-01 11:45:52.772	\N
225c7001-7c17-4745-8f5e-615be20f00e3	Larissa Gonçalves Carvalho	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.773	2026-09-01 11:45:52.773	\N
d8421d2a-8775-467d-ad40-7778b388af83	Gabriela Augusto Merch	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.774	2026-09-01 11:45:52.774	\N
a06abdb6-f5da-461a-9c9b-7c8d12dfabfb	Andressa Duarte de Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.775	2026-09-01 11:45:52.775	\N
393ed71c-3064-4b3e-9799-049e2dea2337	Giovana Figueira Machado	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.776	2026-09-01 11:45:52.776	\N
a1fe7b2e-1b95-4d29-aa3b-a3fc3858f3d6	Francieli Poeta Cardoso	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.777	2026-09-01 11:45:52.777	\N
16a862b4-b364-4771-b7c4-0e8cf9598fa5	Keli de Souza Lucas	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.778	2026-09-01 11:45:52.778	\N
da8b7828-e5c5-4a2e-919e-2cc45988ffe9	Ana Priscila Pereira dos Santos	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.779	2026-09-01 11:45:52.779	\N
ea29a397-91c8-4c50-856a-3bed0bd52305	Keilânia da Silva Tomaz Araujo	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.784	2026-09-01 11:45:52.784	\N
da83a9df-0ca5-4a91-9bf1-3179c045e2d1	Joice Lopes e Lopes	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.785	2026-09-01 11:45:52.785	\N
de6463c8-a6bc-421a-8638-5615b3f7ef1f	Cristiane Lorensi de Oliveira	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.787	2026-09-01 11:45:52.787	\N
492489ab-8f47-421e-b8a7-ed3ac8e8e79a	Michele Alves Louzada	\N	\N	\N	\N	Departamento: Enfermagem	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.79	2026-09-01 11:45:52.79	\N
6978892e-2c0d-45e8-a91d-736a07b28a4f	Rosane Matos de Moura Padilha Quevedo	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.762	2026-09-01 12:01:29.334	\N
e0ec3d8e-e609-4d50-a0c4-a89a153a2966	Tauana Soares Ferreira	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.763	2026-09-01 12:01:29.335	\N
cb26f1bf-54da-4b84-924b-16c6c446f0f2	Sabrina Lopes Pacheco	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.764	2026-09-01 12:01:29.337	\N
a4e8760c-d268-4651-9e5e-f9b2fd271842	Lucas de Souza Borges	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.765	2026-09-01 12:01:29.338	\N
c9a65dc9-2c31-4d55-998e-31fcdd51458d	Jéssica dos Santos Santos	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.766	2026-09-01 12:01:29.339	\N
e52138a0-4222-4deb-8add-7b684e24dd8b	Keli Rodrigues da Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.769	2026-09-01 12:01:29.34	\N
fe3134c6-55f9-4d68-bb94-649441f33fe7	Cristofer Rocha de Araújo	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.77	2026-09-01 12:01:29.341	\N
821b2437-6297-4d5b-be8b-328b92592327	Flávio Makishi Rodrigues	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.771	2026-09-01 12:01:29.342	\N
f431b7f4-2d14-434c-bee2-f60622b9e9ae	João Caron La Salvia	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.774	2026-09-01 12:01:29.343	\N
f339e908-44e7-4b05-9d84-9f39b1f1cdaa	Leandro Soares Padilha	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.781	2026-09-01 12:01:29.343	\N
a8f32c99-7d7b-4e7e-a925-ed9b072c1f12	Roberta Govoni de Azevedo	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.782	2026-09-01 12:01:29.345	\N
29eb00fc-a4a6-48f7-ab44-e67cdfe32c04	Caio Gomes D Alascio	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.783	2026-09-01 12:01:29.346	\N
47636ac8-d2f7-4b53-b45e-a5b60503de18	Alan Souza da Luz	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.786	2026-09-01 12:01:29.347	\N
a0959404-174f-4913-9257-e549b29afcee	Luisa Peixoto da Cunha	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.788	2026-09-01 12:01:29.348	\N
0931743b-c075-4e51-b227-24e3894aae1f	Stiphany Richelle Aparecida Carvalho de França	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.789	2026-09-01 12:01:29.35	\N
571fadc6-72d6-468e-ac90-b6be88f5a42a	Daniel Pellini Manaut	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.792	2026-09-01 12:01:29.351	\N
f0926fb8-1c0a-4189-8eb1-ccedaa3cee7a	Medico Teste da Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	f	2026-09-01 11:40:31.595	2026-09-01 12:01:29.352	2026-09-01 11:46:29.591
38a70dbc-6dce-4fe6-be17-e65039c5fbcc	Sandra Mara Aguirre Freitas	\N	\N	\N	\N	Departamento: Centro ClíNico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.791	2026-09-01 15:03:54.514	\N
6a6d3169-c636-447e-a7f5-590526cb0345	Mircala Waltrich	\N	\N	\N	\N	Departamento: Segurança do Trabalho / SESMT	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.432	2026-09-01 12:01:28.756	\N
7516ff2c-9395-4e9c-9c35-b7b477cafe0d	Paula Roberta Correa Porto	\N	\N	\N	\N	Departamento: Segurança do Trabalho / SESMT	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.47	2026-09-01 12:01:28.773	\N
3769588e-9025-4c0a-b1db-0ed67750ab13	Leonardo Santos Costa	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.477	2026-09-01 12:01:28.776	\N
8e136ed6-cbf1-4a31-b59c-44b5a6a2c5df	Christian Corrêa Coronel	\N	\N	\N	\N	Departamento: Fisioterapia	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.519	2026-09-01 12:01:28.806	\N
4c5dda8d-2b86-46cf-83f9-d2d97c1488ad	Josilaine Torres Madruga	\N	\N	\N	\N	Departamento: Administração	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.527	2026-09-01 12:01:28.81	\N
23e4223d-8c77-4ea4-a949-9dcaf7a8e61f	Rafael da Silva Trindade	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.578	2026-09-01 12:01:28.85	\N
f3ddbe0c-7a73-4da2-83dc-91f8ed819d4b	Ricardo Flores da Costa	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:40:31.597	2026-09-01 12:01:28.865	\N
e7de437d-f009-419c-be12-45fb870af5f5	Erison Diniz da Silva	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.107	2026-09-01 12:01:28.884	\N
024866f3-4723-4ea8-bce7-c9936b32bba5	Silvana Araújo de Souza	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.133	2026-09-01 12:01:28.893	\N
989b5047-c74c-4bd8-8ee4-bd876b575175	Neli da Boa Nova Dalbem	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.151	2026-09-01 12:01:28.902	\N
e67345fb-4050-444a-bec5-3e7e20d7a79d	Kimberly Rosa Martins	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.19	2026-09-01 12:01:28.918	\N
0969a003-72cd-4cee-a62e-da8c2869fbaa	Isabella Pereira da Silva	\N	\N	\N	\N	Departamento: Farmácia	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.229	2026-09-01 12:01:28.939	\N
fbc86f8e-104f-4e71-b832-4d246559a9c8	Mirian Borges de Souza	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.269	2026-09-01 12:01:28.959	\N
d25ed367-ed2e-4c46-b9d0-596a496586c3	Carina Machado de Souza	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.306	2026-09-01 12:01:28.973	\N
2b339536-ce1f-4dd7-9629-2d89544cb232	Tatiane Santos Silva e Silva	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.322	2026-09-01 12:01:28.985	\N
9b2c67f1-3d2f-411e-ab95-90774b0c0eb4	Paluane Tamyris Nunes Severo	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.344	2026-09-01 12:01:28.999	\N
c0841b0c-d458-4639-b307-3cca035347a9	Pamela Alves dos Santos	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.374	2026-09-01 12:01:29.013	\N
42cfc572-9eb8-4d42-98b1-5d356d0913a4	Elba Alviene Pires da Rocha	\N	\N	\N	\N	Departamento: Laboratório	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.38	2026-09-01 12:01:29.02	\N
dcc47770-5f05-4c2c-8a9b-989db7734d7b	Thaila Silveira Gonçalves	\N	\N	\N	\N	Departamento: Bloco Cirúrgico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.422	2026-09-01 12:01:29.043	\N
fc2605ad-fe84-4edb-ab49-e4faab97dba3	Maria Ivonete de Araujo Ferreira	\N	\N	\N	\N	Departamento: Higienização	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.457	2026-09-01 12:01:29.063	\N
70106c92-8e04-4264-9669-46511efd69b4	Lecyane Leite Marques	\N	\N	\N	\N	Departamento: Recepção	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.492	2026-09-01 12:01:29.082	\N
9a032ddc-7fa1-4eff-9caf-7759cdbd501d	Alexandre Perin Decol	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.513	2026-09-01 12:01:29.092	\N
f13cbc22-2f1c-4ff8-a7da-f2676da85818	Anna Caroline de Tunes Silva Azevedo	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.524	2026-09-01 12:01:29.103	\N
d14333ce-c888-458d-b3d9-4b4cf41df4de	Antonio Carlos de Lima Basso Mainardi	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.525	2026-09-01 12:01:29.105	\N
588ff0b2-5666-4baf-a075-6c82b9cd5e49	Carlos Eduardo Tejera de Moura	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.535	2026-09-01 12:01:29.113	\N
e981e36c-24e8-448a-9763-960b85ccc954	Dayane Fernandes dos Anjos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.549	2026-09-01 12:01:29.127	\N
631cf4ae-ec8a-4049-b6d9-61f55dbd9282	Eduardo de Carvalho Mazzocato	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.56	2026-09-01 12:01:29.139	\N
aa27f230-8d07-4632-ba58-2a389d121b59	Fabiano Costa Martins	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.565	2026-09-01 12:01:29.143	\N
dabc2516-3289-4ca0-a5a9-2735acb09d82	Giancarlo Franceschi Dalla	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.579	2026-09-01 12:01:29.155	\N
b2ab1adb-fb06-417c-a08a-d91949d1bb03	Isadora Linck da Silva Ramos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.592	2026-09-01 12:01:29.167	\N
8dbae343-9052-4418-b71c-d2c6265c0e0e	Joao Vitor Silverio Stolk	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.604	2026-09-01 12:01:29.181	\N
7a674e3e-c7bf-458e-8a1c-b3ee6149ebd0	Johnata dos Santos da Silva	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.605	2026-09-01 12:01:29.182	\N
8af51537-6bdb-4602-b11a-a1e9b05bcabf	Jorge Miguel Garbey Reyna	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.606	2026-09-01 12:01:29.183	\N
125a931b-4224-4d12-aa95-f33707382aef	Lara Beatriz Silva Goncalves Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.619	2026-09-01 12:01:29.196	\N
dd9a56e2-eb8a-44bc-8f5a-707e6535ea77	Marina Franz	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.644	2026-09-01 12:01:29.22	\N
0e5cffd4-e895-4828-8715-d05f0b2a250a	Michele da Silva Schons	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.654	2026-09-01 12:01:29.23	\N
cc428315-4166-49c5-b201-085ab509c682	Norma Bier Vieira	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.666	2026-09-01 12:01:29.242	\N
ca61ccf8-8ec0-4684-aabf-a7f34066f7b9	Peterson Rech Honorato	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.682	2026-09-01 12:01:29.254	\N
7d08260d-502f-41f1-b68b-bee59f3752bc	Plinio Moojen Arpini	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.684	2026-09-01 12:01:29.256	\N
10ecd7c7-ef4c-4009-918a-49c45462c73d	Priscila de Almeida Cavilhas	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.685	2026-09-01 12:01:29.257	\N
03570c35-3cb3-432f-9c73-09e1eb41490b	Ricardo Dal Sasso	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.699	2026-09-01 12:01:29.271	\N
b76aa879-a50a-4715-9b7f-9ba1fe86d2c3	Romulo Cezar dos Santos	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.71	2026-09-01 12:01:29.282	\N
5b175d4a-6cf6-4e95-814a-3462fc4e1ea8	Sabrina Roberto Kottwitz	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.722	2026-09-01 12:01:29.293	\N
818fcf0e-3110-40ce-8815-1db708b0a386	Thomaz Monteiro Cardoso	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.735	2026-09-01 12:01:29.306	\N
af29d30a-7f07-4ba6-adea-e2a5e5ce510c	Vitoria Schutt Zizemer	\N	\N	\N	\N	Departamento: Médicos / Corpo Clínico	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.747	2026-09-01 12:01:29.32	\N
ee74a35f-6a6c-4502-bb7d-688f500bc73a	Tayná de Paula Cardoso	\N	\N	\N	\N	Departamento: Nutrição	\N	\N	\N	f	\N	t	2026-09-01 11:45:52.761	2026-09-01 12:01:29.332	\N
\.


--
-- Data for Name: home_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.home_content (id, hero_badge, hero_title, hero_subtitle, foundation_year, foundation_date, board_badge, board_title, board_subtitle, board_members, updated_at, history_blocks) FROM stdin;
default-home-content	Associação dos Funcionários do Hospital de Caridade de São Jerônimo	União, Valorização e Benefícios para os Servidores do HRSJ	Desde 200, atuamos na integração, apoio social e busca contínua de vantagens exclusivas para os profissionais de saúde e colaboradores do Hospital Regional São José.	2000	15 de Maio	• Diretoria Eleita Ativa	Gestão Atual (Biênio 2025 / 2027)	Liderança e Transparência	[{"role": "Presidente", "associateId": "9458f223-581c-43ba-bb0c-2f176e701737", "fallbackName": "Rodrigo Pedroso Poeta", "fallbackSubtext": "Hospital Regional São José"}, {"role": "Vice-Presidente", "fallbackName": "Dra. Juliana Barbosa Santos", "fallbackSubtext": "Enfermagem Geral"}, {"role": "Tesoureiro Geral", "fallbackName": "Marcelo Oliveira Silva", "fallbackSubtext": "Setor Administrativo"}, {"role": "Secretária Geral", "fallbackName": "Ana Paula da Silva", "fallbackSubtext": "Recursos Humanos"}]	2026-08-27 18:46:56.601	[{"id": "block-1", "title": "Nossa História & Fundação", "content1": "A Associação dos Funcionários do Hospital Regional São José foi fundada em 15 de maio de 1995 a partir da iniciativa de uma comissão de servidores que buscava fortalecer a união da categoria e criar uma rede de apoio mútuo entre os profissionais da saúde.", "content2": "Ao longo de três décadas de história, a associação expandiu sua atuação, tornando-se referência na promoção de bem-estar, celebrações comunitárias e convênios na Grande Florianópolis."}, {"id": "block-2", "title": "Por que & Por quem fomos criados?", "content1": "Criada pelos próprios servidores do HRSJ (médicos, enfermeiros, técnicos, farmacêuticos, administrativos e equipe de apoio), a associação tem como missão cuidar de quem dedica a vida ao cuidado dos outros.", "content2": "Nosso objetivo é proporcionar benefícios financeiros reais (descontos no comércio, saúde e educação), carteirinha de identificação oficial de associado e eventos sociais de integração."}]
\.


--
-- Data for Name: ldap_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ldap_users (id, username, nome_completo, email, telefone, cpf, departamento, created_at, updated_at, deleted_at) FROM stdin;
334975b7-989e-4309-b057-fac8458034e7	mateus.lopes	Mateus Peres Lopes	mateus.lopes@hsjeronimo.com.br	51995365718	05144512038	TI	2026-08-27 17:35:23.942	2026-08-27 17:35:23.942	\N
34879a1f-98ed-4006-a4f3-0ce021bd4a31	pablo.santos	Pablo Aires dos Santos	pablo.santos@hsjeronimo.com.br	51996523374	05371016082	TI	2026-08-27 17:54:58.853	2026-08-27 17:54:58.853	\N
\.


--
-- Data for Name: partner_benefits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partner_benefits (id, name, category, discount_percentage, description, location, phone, website, image_url, active, created_at, updated_at, deleted_at) FROM stdin;
ce4e75f6-0066-4cc4-8e07-beea7588c51d	Drogaria & Farmácia São José	SAUDE	20% OFF	Desconto de 20% em medicamentos genéricos e 10% em perfumaria na apresentação da carteirinha da associação.	Rua Adolfo Donato da Silva, 45 - Praia Comprida, São José	(48) 3247-0000	https://farmaciasaojose.com.br	https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=60	t	2026-08-31 12:20:25.319	2026-08-31 12:20:25.319	\N
4308b5c4-49c9-4317-bf15-abc02758b0de	Restaurante Sabor & Saúde	ALIMENTACAO	15% OFF	Desconto no buffet no almoço de segunda a sexta para funcionários associados do HRSJ.	Av. Leoberto Leal, 1200 - Barreiros, São José	(48) 3346-5544	https://instagram.com/restaurantesaboresaude	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60	t	2026-08-31 12:20:25.319	2026-08-31 12:20:25.319	\N
83a35099-4217-4168-a172-837d0996ae8d	Academia FitLife São José	SAUDE	25% OFF	Isenção de taxa de matrícula e 25% de desconto nas mensalidades do plano anual.	Rua Kobrasol, 300 - Kobrasol, São José	(48) 99654-3210	https://fitlife.com.br	https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60	t	2026-08-31 12:20:25.319	2026-08-31 12:20:25.319	\N
6510c77f-d12c-4d2c-b9dc-d499ef6f66dc	Faculdade & Centro Universitário Unifa	EDUCACAO	30% OFF	Bolsa de 30% de desconto para cursos de graduação e pós-graduação EAD e presenciais.	Rodovia BR-101, Km 205 - São José	(48) 0800-700-1000	https://unifa.edu.br	https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=60	t	2026-08-31 12:20:25.319	2026-08-31 12:20:25.319	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, active, created_at, updated_at) FROM stdin;
6bb3d8e0-4a99-483f-94ff-48362de36080	Administrador Central	centraladmin2026@email.com	$2b$10$pfc.wI2R/zcXcQ5Gl6wzWusOBIL9AMZCmj/I7JHruLwcsenZg5UP2	ADMIN	t	2026-08-28 12:12:08.362	2026-08-31 12:20:25.402
\.


--
-- Name: associates associates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associates
    ADD CONSTRAINT associates_pkey PRIMARY KEY (id);


--
-- Name: home_content home_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.home_content
    ADD CONSTRAINT home_content_pkey PRIMARY KEY (id);


--
-- Name: ldap_users ldap_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ldap_users
    ADD CONSTRAINT ldap_users_pkey PRIMARY KEY (id);


--
-- Name: partner_benefits partner_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_benefits
    ADD CONSTRAINT partner_benefits_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: associates_card_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX associates_card_number_key ON public.associates USING btree (card_number);


--
-- Name: associates_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX associates_cpf_key ON public.associates USING btree (cpf);


--
-- Name: associates_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX associates_email_key ON public.associates USING btree (email);


--
-- Name: ldap_users_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ldap_users_cpf_key ON public.ldap_users USING btree (cpf);


--
-- Name: ldap_users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ldap_users_email_key ON public.ldap_users USING btree (email);


--
-- Name: ldap_users_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ldap_users_username_key ON public.ldap_users USING btree (username);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- PostgreSQL database dump complete
--

\unrestrict AzXpXhv140te03qJOxr8gyBMPGPDN17MpbZLf4xwd2eyQbcGF7U79rhW3MDeuna

