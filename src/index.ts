import "module-alias/register";
import os from "os";
import { dirs } from "@utils/filesystem";
import { capitalize, ints } from "@utils/string";
import { tail } from "@utils/array";
import { Separator, confirm, select } from "@inquirer/prompts";

const usageToTotalUsageMS = (elapUsage: NodeJS.CpuUsage) => {
  const elapUserMS = elapUsage.user / 1000.0;
  const elapSystMS = elapUsage.system / 1000.0;

  return elapUserMS + elapSystMS;
};

const hrtimeToMS = (hrtime: [number, number]) =>
  hrtime[0] * 1000.0 + hrtime[1] * Math.pow(10, -6);

const bToMb = (b: number) => b / Math.pow(2, 20);

const perf = (startTime: [number, number], startUsage: NodeJS.CpuUsage) => {
  const elapTimeMS = hrtimeToMS(process.hrtime(startTime));
  const elapUsageMS = usageToTotalUsageMS(process.cpuUsage(startUsage));
  const cpuPercent = ((100.0 * elapUsageMS) / elapTimeMS).toFixed(1);

  return { elapTimeMS, cpuPercent };
};

const ask = () => {
  const days = dirs(__dirname, /^day\d+/).map(({ name: dirName }) => ({
    name: `${capitalize(dirName.substring(0, 3))} ${parseInt(
      dirName.substring(3)
    )}`,
    value: dirName,
  }));

  select({
    message: "Which day?",
    choices: days.reverse(),
    pageSize: Math.ceil(days.length / 2),
  }).then((day) => {
    const dayDir = `${__dirname}/${day}`;
    const dayFile = require(`${dayDir}`);

    select({
      message: "Which part?",
      choices: [
        { name: "Part 02", value: "part2" },
        { name: "Part 01", value: "part1" },
        new Separator(),
        { name: "Change day", value: "back" },
      ],
    }).then(async (part) => {
      if (part === "back") {
        ask();
      } else {
        let example = false;

        if ([14, 15, 20, 22].includes(tail(ints(day)))) {
          example = await confirm({
            message: "Run example?",
            default: false,
          });
        }

        const startTime = process.hrtime();
        const startUsage = process.cpuUsage();

        const solution = dayFile[part](example);

        const { elapTimeMS: took, cpuPercent: cpu } = perf(
          startTime,
          startUsage
        );
        const memUsageMB = bToMb(process.memoryUsage().heapUsed);

        console.log(
          "\u001b[42m The solution is: \u001b[1m" +
            solution +
            "\u001b[22m" +
            (part.endsWith("Example")
              ? " "
              : ` (took ${took.toFixed(1)} ms, avg cpu (${
                  os.cpus().length
                }): ${cpu}%, avg mem: ${memUsageMB.toFixed(1)} MB) `) +
            "\u001b[0m"
        );

        confirm({
          message: "Another? (Default: Yes)",
          default: true,
        }).then((another) => {
          if (another) ask();
          else console.log("Thank you for solving AOC 22! ✨");
        });
      }
    });
  });
};

if (require.main === module) {
  ask();
}
