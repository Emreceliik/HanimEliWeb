--
-- PostgreSQL database dump
--

-- Dumped from database version 13.18
-- Dumped by pg_dump version 13.18

-- Started on 2024-12-09 14:57:05

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 200 (class 1259 OID 16396)
-- Name: kullanici; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kullanici (
    kullanici_id integer NOT NULL,
    sifre text NOT NULL,
    sifre_tekrar text NOT NULL,
    e_posta character varying(50) NOT NULL,
    cinsiyet character varying(20) NOT NULL,
    kayit_tarihi timestamp without time zone NOT NULL
);


ALTER TABLE public.kullanici OWNER TO postgres;

--
-- TOC entry 2984 (class 0 OID 16396)
-- Dependencies: 200
-- Data for Name: kullanici; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kullanici (kullanici_id, sifre, sifre_tekrar, e_posta, cinsiyet, kayit_tarihi) FROM stdin;
\.


--
-- TOC entry 2853 (class 2606 OID 16403)
-- Name: kullanici kullanici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanici
    ADD CONSTRAINT kullanici_pkey PRIMARY KEY (kullanici_id);


-- Completed on 2024-12-09 14:57:06

--
-- PostgreSQL database dump complete
--

