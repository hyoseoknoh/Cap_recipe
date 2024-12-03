// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const path = require('path');
// const puppeteer = require('puppeteer'); // 크롤링에 사용
// require('dotenv').config();

// const app = express();

// // CORS 설정
// const corsOptions = {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
// };
// app.use(cors(corsOptions));

// // JSON 및 URL-encoded 데이터 크기 제한 설정
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // 정적 파일 경로 설정
// app.use('/images', express.static(path.join(__dirname, 'recipe_src')));

// // MySQL 연결 설정
// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '00000000',
//     database: 'FOOD',
// });

// conn.connect(err => {
//     if (err) {
//         console.error('DB 연결 실패:', err);
//         process.exit(1);
//     }
//     console.log('DB 연결 성공');
// });

// // Puppeteer를 이용한 조리 순서 텍스트 크롤링 함수
// async function scrapeRecipeSteps(recipeId) {
//     const url = `https://m.10000recipe.com/recipe/${recipeId}`;
//     const browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });
//     const page = await browser.newPage();

//     try {
//         await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//         // 조리 순서 텍스트 크롤링
//         const steps = await page.$$eval('.step_list.st_thumb li', nodes => {
//             return nodes.map(node => ({
//                 description: node.querySelector('.step_list_txt_cont') 
//                     ? node.querySelector('.step_list_txt_cont').innerText.trim() 
//                     : '',
//             }));
//         }).catch(() => []);

//         await browser.close();
//         return steps;
//     } catch (error) {
//         console.error('레시피 크롤링 중 오류 발생:', error);
//         await browser.close();
//         return [];
//     }
// }

// // `/recipes` 엔드포인트: 메인 화면용 데이터 제공
// app.get('/recipes', (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;
//     const offset = (page - 1) * limit;

//     conn.query('SELECT * FROM recipe LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
//         if (err) {
//             console.error('레시피 조회 중 오류 발생:', err);
//             return res.status(500).send('Internal Server Error');
//         }
//         res.json(results);
//     });
// });

// // `/recipe/:id` 엔드포인트: 상세 페이지 데이터 반환
// app.get('/recipe/:id', async (req, res) => {
//     const recipeId = req.params.id;

//     try {
//         conn.query('SELECT * FROM recipe WHERE id = ?', [recipeId], async (err, results) => {
//             if (err) {
//                 console.error(`레시피 ID ${recipeId} 조회 중 오류 발생:`, err);
//                 return res.status(500).send('Internal Server Error');
//             }

//             if (results.length === 0) {
//                 return res.status(404).send('레시피를 찾을 수 없습니다.');
//             }

//             const recipeData = results[0];

//             // 조리 순서 텍스트 크롤링
//             const stepsFromCrawl = await scrapeRecipeSteps(recipeId);

//             // 조리 순서 이미지 경로 추가
//             const steps = stepsFromCrawl.map((step, index) => ({
//                 description: step.description,
//                 image: `${req.protocol}://${req.get('host')}/images/${recipeId}/${recipeId}_step${index + 1}.jpg`,
//             }));

//             res.json({
//                 recipe: {
//                     id: recipeData.id,
//                     name: recipeData.Name,
//                     ingredients: recipeData.Ingredients,
//                     mainImage: `${req.protocol}://${req.get('host')}/images/${recipeId}/${recipeId}_main.jpg`,
//                     steps: steps,
//                 },
//             });
//         });
//     } catch (error) {
//         console.error('레시피 상세 페이지 처리 중 오류:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // 서버 시작
// const PORT = 8080;
// app.listen(PORT, () => {
//     console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
// });



const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const puppeteer = require('puppeteer'); // 크롤링에 사용
require('dotenv').config();

const app = express();

// CORS 설정
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// JSON 및 URL-encoded 데이터 크기 제한 설정
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 정적 파일 경로 설정
app.use('/images', express.static(path.join(__dirname, 'recipe_src')));

// MySQL 연결 설정
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '00000000',
    database: 'FOOD',
});

conn.connect(err => {
    if (err) {
        console.error('DB 연결 실패:', err);
        process.exit(1);
    }
    console.log('DB 연결 성공');
});

// Puppeteer를 이용한 조리 순서 텍스트 크롤링 함수
async function scrapeRecipeSteps(recipeId) {
    const url = `https://m.10000recipe.com/recipe/${recipeId}`;
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // 조리 순서 텍스트 크롤링
        const steps = await page.$$eval('.step_list.st_thumb li', nodes => {
            return nodes.map(node => ({
                description: node.querySelector('.step_list_txt_cont')
                    ? node.querySelector('.step_list_txt_cont').innerText.trim()
                    : '',
            }));
        }).catch(() => []);

        await browser.close();
        return steps;
    } catch (error) {
        console.error('레시피 크롤링 중 오류 발생:', error);
        await browser.close();
        return [];
    }
}

// `/recipes` 엔드포인트: 검색 기능 추가
app.get('/recipes', (req, res) => {
    const query = req.query.query || ''; // 검색어 가져오기
    const sql = query
        ? 'SELECT * FROM recipe WHERE Name LIKE ?'
        : 'SELECT * FROM recipe ORDER BY RAND() LIMIT 6'; // 랜덤 6개 레시피 반환
    const params = query ? [`%${query}%`] : [];

    conn.query(sql, params, (err, results) => {
        if (err) {
            console.error('레시피 조회 중 오류 발생:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

// `/recipe/:id` 엔드포인트: 상세 페이지 데이터 반환
app.get('/recipe/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        conn.query('SELECT * FROM recipe WHERE id = ?', [recipeId], async (err, results) => {
            if (err) {
                console.error(`레시피 ID ${recipeId} 조회 중 오류 발생:`, err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length === 0) {
                return res.status(404).send('레시피를 찾을 수 없습니다.');
            }

            const recipeData = results[0];

            // 조리 순서 텍스트 크롤링
            const stepsFromCrawl = await scrapeRecipeSteps(recipeId);

            // 조리 순서 이미지 경로 추가
            const steps = stepsFromCrawl.map((step, index) => ({
                description: step.description,
                image: `${req.protocol}://${req.get('host')}/images/${recipeId}/${recipeId}_step${index + 1}.jpg`,
            }));

            res.json({
                recipe: {
                    id: recipeData.id,
                    name: recipeData.Name,
                    ingredients: recipeData.Ingredients,
                    mainImage: `${req.protocol}://${req.get('host')}/images/${recipeId}/${recipeId}_main.jpg`,
                    steps: steps,
                },
            });
        });
    } catch (error) {
        console.error('레시피 상세 페이지 처리 중 오류:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 서버 시작
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});