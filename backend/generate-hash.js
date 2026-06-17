import bcrypt from "bcrypt";

const plainPassword = "So_132503";

const run = async () => {
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Hash generado:", hash);
};

run();
