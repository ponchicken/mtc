console.log('');

let dubles = [];
let newdata = {};

function utf8_to_b64(str) {
    return btoa(encodeURIComponent(escape(str)));
}

function getAll1Level(data) {
    let result = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {

            let element = data[key];

            if (!Array.isArray(element)) {

                result[key] = element;
            }
        }
    }

    return result;
}

function parse(data, level = 1, path = '') {
    console.log(data);

    if (!data) {
        return;
    }

    if (level > 3) {
        console.log('level greater', level, path, data);
        return;
    }

    if (Array.isArray(data)) {
        let index = 0;
        for (const item of data) {
            parse(item, level + 1, path + `[${index}]`);
            index++;
        }
        return;
    } else {

        for (const key in data) {
            if (data.hasOwnProperty(key)) {

                let e = data[key];
                let p = path + '/' + key;

                if (Array.isArray(e)) {
                    parse(e, level + 1, p);
                } else {
                    let i = dubles
                        .map(d => d.value)
                        .indexOf(key);

                    if (i !== -1) {
                        dubles[i].count++;

                        let h = utf8_to_b64(JSON.stringify(e));
                        dubles[i]
                            .paths
                            .push({path: p, hash: h});

                        if (dubles[i].paths.map(p => p.hash).indexOf(h) === -1) {
                            dubles[i]
                                .objects
                                .push(e);
                        }
                    } else {
                        dubles.push({
                            value: key,
                            count: 1,
                            type: typeof(e),
                            paths: [
                                {
                                    path: p,
                                    hash: utf8_to_b64(JSON.stringify(e))
                                }
                            ],
                            objects: [e]
                        });
                    }

                    parse(e, level + 1, p);
                }
            }
        }
    }
}

fetch('http://213.108.129.190/xml/get-temp-data')
    .then(res => res.json())
    .then(data => {

        parse(data);

        console.log('source', data);
        console.log('1level', getAll1Level(data));
        console.log('dubles', dubles.filter(d => d.count > 1 && d.type === 'object'));
    });