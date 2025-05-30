import {glob} from 'glob';
import fs from 'node:fs';
import path from 'path';

export function verifyFileExists(outputBaseName, stepNumber, contents) {
    const filePath = path.join(__dirname, `${outputBaseName}-${stepNumber}.js`);
    expect(fs.existsSync(filePath)).toBe(true);

    if (contents) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        expect(fileContent).toBe(contents);
    }

    fs.unlinkSync(filePath, err => {
        if (err) {
            console.error(`Error removing file: ${err.message}`);
            return;
        }
    });
    expect(fs.existsSync(filePath)).toBe(false);
}

export function getOutputFiles(outputBaseName) {
    return glob.sync(`**/${outputBaseName}-*.js`, {cwd: __dirname});
}