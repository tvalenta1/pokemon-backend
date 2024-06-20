import { Seeder } from "@mikro-orm/seeder";
import { User } from "../../modules/user/user.entity.js";

import type { EntityManager } from "@mikro-orm/core";

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = new User(
      "Test",
      "User",
      "testuser@example.com",
      "supersecret"
    );
    em.create(User, user);
  }
}
