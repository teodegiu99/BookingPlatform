DO $$

DECLARE

    t_name text;

BEGIN

    FOR t_name IN

        SELECT quote_ident(tablename)

        FROM pg_tables

        WHERE schemaname = 'zblb'

    LOOP

     --   EXECUTE 'TRUNCATE TABLE zblb.' || t_name || ' CASCADE';

    END LOOP;

END $$;
