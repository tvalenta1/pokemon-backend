#!/bin/sh

if [ -e db-migrated-and-seeded ]; then
  echo "Database was already migrated and seeded."
else
  yarn mikro-orm-esm migration:fresh --seed && touch db-migrated-and-seeded
fi;
