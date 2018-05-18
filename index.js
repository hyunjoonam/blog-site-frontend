// http://localhost:3000
// http://localhost:3000/new/

const express = require('express');
const util = require('util');
const fs = require('fs');
const bodyParser = require('body-parser');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public')); //

// app.use('/new', [
//     check('first_name').is_required().with_message('first name is required')
//     check('last_name').is_required().with_message('last name is required')
//     ]
// )

app.get('/api/blog', (request, response) => {
    readFile('blog-data.json')
        .then((data) => {
            const blogPosts = JSON.parse(data);
            const allPosts = [];
            for (const key in blogPosts) {
                const post = blogPosts[key];
                allPosts.push({
                    id: post.id,
                    author: `${post.first_name} ${post.last_name}`,
                    title: post.title,
                })
            }
            response.json(allPosts);
        });
});

app.get('/api/blog/:id', (request, response) => {
    const id = Number(request.params.id);

    readFile('blog-data.json')
        .then((data) => {
            const blogData = JSON.parse(data)
            if (blogData[id]) {
                response.json(blogData[id]);
            } else {
                response.json({});
            }
        });
});

app.post('/api/new', (request, response) => {
    readFile('blog-data.json')
        .then((data) => {
            return JSON.parse(data);
        })
        .then((data) => {
            const id = Object.keys(data).length + 1;
            const date = new Date(Date.now());
            const dateString = (date.getMonth() + 1) + '/' + (date.getDay() + 1) + '/' + date.getFullYear();
            while (data[id]) {
                id++;
            }
            const newEntry = {
                id,
                date: dateString,
                ...request.body
            };
            data[id] = newEntry;

            return writeFile('blog-data.json', JSON.stringify(data, null, '\t'))
                .then(() => {
                    return newEntry;
                });
        })
        .then((newEntry) => {
            response.json(newEntry);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});
