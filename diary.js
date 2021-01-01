const fs = require("fs");
const path = require("path");

const date = new Date();
const today = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
const now = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const args = process.argv.slice(2);

const operation = args.length === 0 ? "help" : args.shift();
console.log(args);

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
    cng(...args);
    break;
  case "del":
    del(...args);
    break;
  default:
    console.log('ERROR: unidentified operation, try `diary help` for more info');
}

console.log(reply);

function help() {
  const info = `Usage :-
  Note: 
    [] denotes optional parameters and all optional parameters have a default value (refer bellow)
    date format is dd-mm-yyyy
  
  Commands:
    $ diary add "entry content" [date] [time]    # Add an entry 
    $ diary log [date] [index]                   # Log a specific entry or all entries on a date
    $ diary del [date] [index]                   # Delete a specific entry or all entries on a date
    $ diary cng date index "new content"         # Edit an entry
    $ diary help                                 # Show usage
  
  Default Values:
    [date]  - today // current day's date
    [time]  - now   // current time
    [index] - 0     // 0 means all
  `;
  console.log(info);
}

function add(content, date=today, time=now) {
  if(content === undefined) return `ERROR: content not availabe`;
  
  const [day, month, year] = date.split("-");
  const y_dir = path.join(__dirname, `${year}`);
  const m_dir = path.join(y_dir, `${month}`);
  if (!fs.existsSync(y_dir)) fs.mkdirSync(y_dir);
  if (!fs.existsSync(m_dir)) fs.mkdirSync(m_dir);

  const file = path.join(m_dir, `${day}.txt`);
  const message = `[${time}] ${content}\n`;
  fs.appendFileSync(file, message);

  return `Entry added successfully :)`;
}

function log(date=today, index=0) {
  const [day, month, year] = date.split("-");
  const y_dir = path.join(__dirname, `${year}`);
  const m_dir = path.join(y_dir, `${month}`);
  const file = path.join(m_dir, `${day}.txt`);
  if (fs.existsSync(file)) {
    const entries = fs.readFileSync(file, "utf-8").trim().split("\n");
    if(index > entries.length) return `Error: index out of bounds`;

    let result = "";
    if(index == 0) for(let i=0; i<entries.length; i++) result += `<${i+1}> ${entries[i]}\n`;
    else result = entries[index-1];

    return result;
  } else return `Sorry, no entries found on ${date} :(`;
}

// diary del date [index]
// diary cng date index "new content"
