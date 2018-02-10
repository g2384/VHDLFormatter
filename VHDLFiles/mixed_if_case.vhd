ARCHITECTURE ARCH OF ENTITY IS
BEGIN
    PROC_1 : PROCESS (a, b, c, d) IS
    BEGIN
        IF (a = 1) THEN
            CASE b
                WHEN 1 =>
                    c <= d;
                    CASE b
                        WHEN 1 =>
                            c <= d;
                        WHEN 2 =>
                            d <= f;
                END CASE;
                WHEN 2 =>
                    d <= f;
            END CASE;
        ELSIF (b = 1) THEN
            CASE b
                WHEN 1 =>
                    c <= d;
                WHEN 2 =>
                    d <= f;
            END CASE;
        ELSE
            CASE b
                WHEN 1 =>
                    c <= d;
                WHEN 2 =>
                    d <= f;
            END CASE;
        END IF;
    END PROCESS PROC_1;
END ARCHITECTURE ARCH;