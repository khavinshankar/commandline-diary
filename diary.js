const { info } = require("console");
const fs = require("fs");
const path = require("path");

const today = new Date().toDateString().slice(4);
const now = new Date().toTimeString().slice(0, 17);

const args = process.argv.slice(2);

const operation = args.length === 0 ? "help" : args.shift();

let reply = null;
switch (operation) {
  case "help":
    help();
    break;
  case "add":
    reply = add(...args);
    break;
  case "log":
    reply = log(...args);
    break;
  case "cng":
    reply = cng(...args);
    break;
  case "del":
    reply = del(...args);
    break;
  default:
    console.log(
      "ERROR: unidentified operation, try `diary help` for more info"
    );
}

if (reply !== null && reply !== undefined) console.log(reply);

function help() {
  const info = `Usage :-
    $ diary add "entry content" [date=today] [time=now]    # Add an entry 
    $ diary log [date=today] [index=all]                   # Log a specific entry or all entries on a date
    $ diary del [date=today] [index=all]                   # Delete a specific entry or all entries on a date
    $ diary cng "new content" [date=today] [index=last]    # Edit an entry
    $ diary help                                           # Show usage
  `;
  console.log(info);
}

function parseDate(date) {
  try {
    return new Date(date).toDateString().slice(4);
  } catch (err) {
    console.log(`ERROR: Please double check the entered date!`);
  }
}

function getFilePath(date, makeDir=false) {
  date = parseDate(date);

  const [month, day, year] = date.split(" ");
  const y_dir = path.join(__dirname, `${year}`);
  const m_dir = path.join(y_dir, `${month}`);
  if (!fs.existsSync(y_dir) && makeDir) fs.mkdirSync(y_dir);
  if (!fs.existsSync(m_dir) && makeDir) fs.mkdirSync(m_dir);

  const filePath = path.join(m_dir, `${day}.txt`);
  return filePath;  
}

function add(content, date=today, time=now) {
  if (content === undefined) return `ERROR: content not availabe`;

  const filePath = getFilePath(date, true);
  const message = `[${time}] ${content}\n`;
  fs.appendFileSync(filePath, message);

  return `Entry added successfully :)`;
}

function log(date=today, index = 0) {
  const filePath = getFilePath(date);
  if (fs.existsSync(filePath)) {
    const entries = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    if (index > entries.length) return `Error: index out of bounds`;

    let result = "";
    if (index == 0)
      for (let i = 0; i < entries.length; i++)
        result += `<${i + 1}> ${entries[i]}\n`;
    else result = entries[index - 1];

    return result;
  } else return `Sorry, no entries found on ${date} :(`;
}

function del(date=today, index = 0) {
  const filePath = getFilePath(date);
  if (fs.existsSync(filePath)) {
    const entries = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    if (index > entries.length) return `Error: index out of bounds`;

    if (index === 0) {
      fs.unlinkSync(filePath);
      return `Successfully deleted all entries on ${date}`;
    } else {
      entries.splice(index - 1, 1);
      const data = entries.join("\n");
      fs.writeFileSync(filePath, data);
      return `Successfully deleted the entry ${index} on ${date}`;
    }
  } else return `Sorry, no entries found on ${date} :(`;
}

function cng(new_content, date=today, index) {
  const filePath = getFilePath(date);
  if (fs.existsSync(filePath)) {
    const entries = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    if(index === undefined || index === null) index = entries.length;
    if (index > entries.length) return `Error: index out of bounds`;

    const [time, content] = entries[index-1].split("] ");
    entries[index-1] = `${time}] ${new_content}`;
    const data = entries.join("\n");
    fs.writeFileSync(filePath, data);
    return `Successfully changed the entry ${index} on ${date}`; 
  } else return `Sorry, no entries found on ${date} :(`;
}
