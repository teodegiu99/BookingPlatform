// "use server";

// import { RegisterSchema } from "@/schemas";
// import * as z from "zod";
// import bcrypt from "bcryptjs";
// import { db } from "@/lib/db";
// import { getUserByEmail } from "@/data/user";

// export const register = async (values: z.infer<typeof RegisterSchema>) => {
//   const validatedFields = RegisterSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Campi non validi." };
//   }

//   const { email, password, name } = validatedFields.data;

//   const existingUser = await getUserByEmail(email);

//   if (existingUser) {
//     return { error: "Email già in uso!" };
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   await db.user.create({
//     data: {
//       name,
//       email,
//       password: hashedPassword,
//     },
//   });

//   return { success: "Registrazione completata con successo!" };
// };
"use server";

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campi non validi." };
  }

  const { email, password, name } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email già in uso!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Successo: ritorniamo email e password per fare login nel client
  return { success: true, email, password };
};