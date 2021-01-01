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
    log(...args);
    break;
  case "cng":
    cng(...args);
    break;
  case "del":
    del(...args);
    break;
  default:
    console.log("ERROR: unidentified operation, try `diary help` for more info");
}

function help() {
  const info = `Usage :-
  Note: 
    [] denotes optional parameters and all optional parameters have a default value (refer bellow)
    date format is dd-mm-yyyy
  
  Commands:
    $ diary add "entry content" [date] [time]    # Add an entry 
    $ diary log date [index]                     # Log a specific entry or all entries on a date
    $ diary del date [index]                     # Delete a specific entry or all entries on a date
    $ diary cng date index "new content"         # Edit an entry
    $ diary help                                 # Show usage
  
  Default Values:
    [date]  - today
    [time]  - now
    [index] - 1
  `;
  console.log(info);
}

function add(content, date=today, time=now) {
  if(content === undefined) return "ERROR: content not availabe";

  const [day, month, year] = date.split("-");
  const y_dir = path.join(__dirname, `${year}`);
  const m_dir = path.join(y_dir, `${month}`);
  if (!fs.existsSync(y_dir)) fs.mkdirSync(y_dir);
  if (!fs.existsSync(m_dir)) fs.mkdirSync(m_dir);

  const file = path.join(m_dir, `${date}.txt`);
  const message = `[${time}] ${content}\n`;
  fs.appendFileSync(file, message);

  return "Entry added successfully :)";
}

// diary add message date time
// diary del date [index]
// diary cng date index "new content"
// diary log date [index]