const yaml = require("js-yaml");
const { writeFileSync: write, readFileSync } = require("fs");

const itransScheme = require("./itransScheme.js");

const schemeCodes = ["deva", "gran", "iast", "knda", "taml", "telu"];

const getSchemeUrl = (scheme) =>
  `../vtranslit-scheme-${scheme}/dist/vtranslit-scheme-${scheme}.npm.js`;

const arrayToObject = (acc, obj) => Object.assign({}, acc, obj);

const mapSchemeToItrans = (data) =>
  Object.entries(data)
    .map(([type, charList]) => ({
      [type]: charList
        .map((char, index) => ({
          [itransScheme[type][index]]: char,
        }))
        .reduce(arrayToObject, {}),
    }))
    .reduce(arrayToObject, {});

const convertSchemeToYaml = (schemeUrl) => {
  const scheme = Object.values(require(schemeUrl))[0];

  const schemeMappedToItrans = mapSchemeToItrans(scheme.data);

  return yaml.dump(
    { ...scheme.about, map: schemeMappedToItrans },
    {
      noCompatMode: true,
      flowLevel: 3,
    }
  );
};

schemeCodes.forEach((schemeCode) => {
  const schemeInYaml = convertSchemeToYaml(getSchemeUrl(schemeCode));

  write(
    `../vtranslit-scheme-${schemeCode}/src/${schemeCode}.yml`,
    `# YAML 1.2\n\n${schemeInYaml}`
  );
});

// write("iast.json", JSON.stringify(yaml.safeLoad(readFileSync("./iast.yml"))));
