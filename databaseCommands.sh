#!/usr/bin/env bash

echo "export PGHOST=db.doc.ic.ac.uk"              >> ~/.pgdb-<your database>-g1527113_u
echo "export PGPORT=5432"                 >> ~/.pgdb-<your database>-g1527113_u
echo "export PGDATABASE=<your database>"         >> ~/.pgdb-<your database>-g1527113_u
echo "export PGUSER=g1527113_u"           >> ~/.pgdb-<your database>-g1527113_u
echo "unset PGPASSWORD"                   >> ~/.pgdb-<your database>-g1527113_u
touch ~/.pgpass
echo "db.doc.ic.ac.uk:*:*:g1527113_u:tVJZsEufUS"        >> ~/.pgpass
chmod 600 ~/.pgpass
