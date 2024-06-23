import { Migration } from "@mikro-orm/migrations";

export class Migration20240620212550 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "evolution_requirement" ("id" serial primary key, "amount" int not null, "name" varchar(255) not null);');

    this.addSql('create table "height" ("id" serial primary key, "minimum" varchar(255) not null, "maximum" varchar(255) not null);');

    this.addSql('create table "pokemon_type" ("type" varchar(255) not null, constraint "pokemon_type_pkey" primary key ("type"));');

    this.addSql('create table "user" ("id" serial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "weight" ("id" serial primary key, "minimum" varchar(255) not null, "maximum" varchar(255) not null);');

    this.addSql('create table "pokemon" ("id" serial primary key, "name" varchar(255) not null, "classification" varchar(255) not null, "weight_id" int not null, "height_id" int not null, "flee_rate" double precision not null, "max_cp" int not null, "max_hp" int not null, "evolution_requirements_id" int null, "evolves_into_id" int null);');
    this.addSql('alter table "pokemon" add constraint "pokemon_weight_id_unique" unique ("weight_id");');
    this.addSql('alter table "pokemon" add constraint "pokemon_height_id_unique" unique ("height_id");');
    this.addSql('alter table "pokemon" add constraint "pokemon_evolution_requirements_id_unique" unique ("evolution_requirements_id");');
    this.addSql('alter table "pokemon" add constraint "pokemon_evolves_into_id_unique" unique ("evolves_into_id");');

    this.addSql('create table "user_favorite_pokemons" ("user_id" int not null, "pokemon_id" int not null, constraint "user_favorite_pokemons_pkey" primary key ("user_id", "pokemon_id"));');

    this.addSql('create table "pokemon_weaknesses" ("pokemon_id" int not null, "pokemon_type_type" varchar(255) not null, constraint "pokemon_weaknesses_pkey" primary key ("pokemon_id", "pokemon_type_type"));');

    this.addSql('create table "pokemon_types" ("pokemon_id" int not null, "pokemon_type_type" varchar(255) not null, constraint "pokemon_types_pkey" primary key ("pokemon_id", "pokemon_type_type"));');

    this.addSql('create table "pokemon_resistant" ("pokemon_id" int not null, "pokemon_type_type" varchar(255) not null, constraint "pokemon_resistant_pkey" primary key ("pokemon_id", "pokemon_type_type"));');

    this.addSql('create table "attack" ("id" serial primary key, "pokemon_id" int null, "type" text check ("type" in (\'fast\', \'special\')) not null);');

    this.addSql('create table "move" ("id" serial primary key, "attack_id" int null, "name" varchar(255) not null, "type_type" varchar(255) not null, "damage" int not null);');

    this.addSql('alter table "pokemon" add constraint "pokemon_weight_id_foreign" foreign key ("weight_id") references "weight" ("id") on update cascade;');
    this.addSql('alter table "pokemon" add constraint "pokemon_height_id_foreign" foreign key ("height_id") references "height" ("id") on update cascade;');
    this.addSql('alter table "pokemon" add constraint "pokemon_evolution_requirements_id_foreign" foreign key ("evolution_requirements_id") references "evolution_requirement" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pokemon" add constraint "pokemon_evolves_into_id_foreign" foreign key ("evolves_into_id") references "pokemon" ("id") on update cascade on delete set null;');

    this.addSql('alter table "user_favorite_pokemons" add constraint "user_favorite_pokemons_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favorite_pokemons" add constraint "user_favorite_pokemons_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_pokemon_type_type_foreign" foreign key ("pokemon_type_type") references "pokemon_type" ("type") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_types" add constraint "pokemon_types_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_types" add constraint "pokemon_types_pokemon_type_type_foreign" foreign key ("pokemon_type_type") references "pokemon_type" ("type") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_resistant" add constraint "pokemon_resistant_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_resistant" add constraint "pokemon_resistant_pokemon_type_type_foreign" foreign key ("pokemon_type_type") references "pokemon_type" ("type") on update cascade on delete cascade;');

    this.addSql('alter table "attack" add constraint "attack_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "move" add constraint "move_attack_id_foreign" foreign key ("attack_id") references "attack" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "move" add constraint "move_type_type_foreign" foreign key ("type_type") references "pokemon_type" ("type") on update cascade;');
  }

}
