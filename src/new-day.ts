import { Separator, input } from "@inquirer/prompts";
import fs from "fs";

const todaysDay = new Intl.DateTimeFormat("fr-FR", { day: "2-digit" }).format(
  Date.now()
);

const createDayDir = () => {
  input(
      {
        message: "Which day?",
        default: todaysDay,
      })
    .then(async (day) => {
      const todaysDay = day.toString().padStart(2, "0");
      const dirname = `${__dirname}/day${todaysDay}`;

      if (fs.existsSync(dirname)) {
        console.log("Come back tomorrow 🌒");
      } else {
        console.log(`Starting day ${day} ☀️`);
        console.log(new Separator().separator);

        fs.mkdirSync(dirname, { recursive: true, mode: 0o755 });
        const files = {
          "example-input.txt": "",
          "index.ts": fs.readFileSync(`${__dirname}/stubs/index.ts`),
          "input.ts": fs.readFileSync(`${__dirname}/stubs/input.ts`),
          "input.txt": "",
        };
        Object.entries(files).forEach(([file, data]) => {
          const filePath = `${dirname}/${file}`;
          const stream = fs.createWriteStream(filePath);
          if (data !== "") {
            stream.write(data);
          }
          stream.close();
        });

        console.log("Your files are ready at:");
        console.log(dirname);
        Object.keys(files).forEach((file) => {
          console.log(` - ${file}`);
        });

        console.log("\nHave a nice day ✨");
      }
    });
};

if (require.main === module) {
  createDayDir();
}
