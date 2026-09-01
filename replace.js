const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return callback(err);
        var pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        pending--;
                        if (!pending) callback(null);
                    });
                } else {
                    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                        let content = fs.readFileSync(file, 'utf8');
                        if (content.includes('http://localhost:8000')) {
                            content = content.replace(/http:\/\/localhost:8000/g, 'https://wishesbackend.vercel.app');
                            fs.writeFileSync(file, content, 'utf8');
                            console.log('Updated', file);
                        }
                    }
                    pending--;
                    if (!pending) callback(null);
                }
            });
        });
    });
}

walk('d:/chitoria.dev/src', (err) => {
    if (err) console.error(err);
    else console.log('Done frontend replacements');
});
