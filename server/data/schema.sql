SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

DROP TABLE users;
DROP TABLE sessions;
DROP TABLE tokens;
DROP TABLE tasks;


-- sessions
CREATE TABLE sessions (
    sid text NOT NULL,
    session text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone
);

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);

-- tasks
CREATE TABLE tasks (
    id integer NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    complete_by date,
    archived_at timestamp without time zone,
    user_id integer NOT NULL
);

CREATE SEQUENCE tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE tasks_id_seq OWNED BY tasks.id;

ALTER TABLE ONLY tasks ALTER COLUMN id SET DEFAULT nextval('tasks_id_seq'::regclass);

ALTER TABLE ONLY tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);

-- users
CREATE TABLE users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    last_logged_in_at timestamp without time zone
);

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE users_id_seq OWNED BY users.id;

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- tokens
CREATE TABLE tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL
);

CREATE SEQUENCE tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE tokens_id_seq OWNED BY tokens.id;

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);
