import PrettyError from "pretty-error";

const notifyError = err => {
  let pe = new PrettyError();
  console.log(pe.render(err));
};

const notifyWarning = warning => {
  let pe = new PrettyError();
  console.log(pe.render(warning));
};

export default function (stats) {
  let { errors, warnings } = stats.toJson();

  if (errors.length) {
    errors.forEach(notifyError);
  }
  else if (warnings.length) {
    warnings.forEach(notifyWarning);
  }
  else {
    console.log(stats.toString({
      chunks: false,
      colors: true
    }));
  }
}
