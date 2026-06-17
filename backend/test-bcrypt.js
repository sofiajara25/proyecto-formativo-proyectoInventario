import bcrypt from "bcrypt";

const plainPassword = "So_132503"; // la que estás enviando
const hashFromDB = "$2b$10$BOSTVvMAqv3.hF8kCstY6.3uqm5AiOSJAz4XUdCnpxNj2zucJ8PzC"; // el hash que viste en la DB

const runTest = async () => {
    const match = await bcrypt.compare(plainPassword, hashFromDB);
    console.log("¿Coincide?", match);
};

runTest();