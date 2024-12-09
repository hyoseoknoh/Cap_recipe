
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
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
    database: 'new_schema',
    charset: 'utf8mb4', // UTF-8 설정
});

conn.connect(err => {
    if (err) {
        console.error('DB 연결 실패:', err);
        process.exit(1);
    }
    console.log('DB 연결 성공');
});

// `/recipes` 엔드포인트: 검색 기능 추가
// `/recipes` 엔드포인트: 검색 기능 추가
app.get('/recipes', (req, res) => {
    const query = req.query.query || ''; // 검색어 가져오기
    const page = parseInt(req.query.page) || 1; // 페이지 번호 (기본값 1)
    const limit = parseInt(req.query.limit) || 10; // 한 페이지당 데이터 개수 (기본값 10)
    const offset = (page - 1) * limit; // 데이터 시작 지점 계산

    const sql = query
        ? 'SELECT * FROM recipe WHERE Name LIKE ? LIMIT ? OFFSET ?'
        : 'SELECT * FROM recipe ORDER BY RAND() LIMIT ? OFFSET ?';
    const params = query ? [`%${query}%`, limit, offset] : [limit, offset];

    conn.query(sql, params, (err, results) => {
        if (err) {
            console.error('레시피 조회 중 오류 발생:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results); // 검색된 레시피 데이터를 반환
    });
});
// `/recipe/:id` 엔드포인트: 상세 페이지 데이터 반환
app.get('/recipe/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        conn.query('SELECT * FROM recipe WHERE id = ?', [recipeId], (err, recipeResults) => {
            if (err) {
                console.error(`레시피 ID ${recipeId} 조회 중 오류 발생:`, err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (recipeResults.length === 0) {
                return res.status(404).json({ error: '레시피를 찾을 수 없습니다.' });
            }

            const recipeData = recipeResults[0];

            // `recipetest` 테이블에서 조리 순서 가져오기
            conn.query('SELECT Recipe FROM recipetest WHERE id = ?', [recipeId], (err, stepResults) => {
                if (err) {
                    console.error(`조리 순서 조회 중 오류 발생:`, err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (stepResults.length === 0) {
                    return res.status(404).json({ error: '조리 순서를 찾을 수 없습니다.' });
                }

                // 조리 순서 데이터 처리
                let stepsRaw = stepResults[0].Recipe;

                // 특수 문자 제거
                stepsRaw = stepsRaw.replace(/[\uFFFD\u2028\u2029]/g, ''); // UTF-8에서 문제가 될 수 있는 특수 문자 제거

                const stepsArray = stepsRaw.split('@').map((step, index) => ({
                    description: step.trim(),
                    image: `${req.protocol}://${req.get('host')}/images/${recipeId}/${recipeId}_step${index + 1}.jpg`,
                }));

                // JSON 응답 반환
                res.json({
                    recipe: {
                        id: recipeData.id,
                        name: recipeData.Name,
                        ingredients: recipeData.Ingredients,
                        mainImage: `${req.protocol}://${req.get('host')}/images/${recipeId}/${recipeId}_main.jpg`,
                        steps: stepsArray,
                    },
                });
            });
        });
    } catch (error) {
        console.error('레시피 상세 페이지 처리 중 오류:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 검색기능 - 유저가 입력한 재료로 검색
// app.get('/search', async (req, res) => {
//     const userInput1 = req.query.ingredients;
//     const ingredients = userInput1 ? userInput1.split(',').map(item => item.trim()) : [];

//     if (!ingredients.length) {
//         return res.status(400).json({ error: '재료를 입력해 주세요.' });
//     }

//     try {
//         // 유저가 입력한 재료로 검색할 쿼리 준비
//         let ingredientConditions = ingredients.map(ingredient => {
//             const values = Array(29).fill(ingredient);
//             return values.map((_, index) => `ingredient${index + 1} = ?`).join(' OR ');
//         }).join(' OR ');

//         const ingredientValues = ingredients.flatMap(ingredient => Array(29).fill(ingredient));

//         // `ingredientData` 테이블에서 해당 재료가 포함된 레시피를 검색
//         const query = `SELECT DISTINCT id FROM ingredientData WHERE ${ingredientConditions}`;
//         conn.query(query, ingredientValues, async (err, results) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Internal Server Error');
//             }

//             const recipeIds = results.map(result => result.id);
//             if (recipeIds.length === 0) {
//                 return res.status(404).json({ error: '검색된 레시피가 없습니다.' });
//             }

//             // 검색된 레시피 ID로 레시피 상세정보를 조회
//             const recipes = [];
//             for (let i = 0; i < recipeIds.length; i++) {
//                 const recipeResult = await new Promise((resolve, reject) => {
//                     conn.query('SELECT * FROM recipe WHERE id = ?', [recipeIds[i]], (err, recipe) => {
//                         if (err) return reject(err);
//                         resolve(recipe[0]);
//                     });
//                 });
//                 // 겹치는 재료 수를 계산하여 점수를 부여 (점수 계산 로직)
//                 const matchedIngredients = calculateMatchScore(recipeResult, ingredients);
//                 recipeResult.matchScore = matchedIngredients;
//                 recipes.push(recipeResult);
//             }

//             // matchScore로 내림차순 정렬
//             recipes.sort((a, b) => b.matchScore - a.matchScore);

//             res.json({ recipes });
//         });
//     } catch (error) {
//         console.error('검색 중 오류 발생:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
app.get('/search', async (req, res) => {
    const userInput1 = req.query.ingredients;
    const ingredients = userInput1.split(',').map(item => item.trim());
    console.log(req.query.not_ingredients);
    let userInput2;
    let not_ingredients;
    if (userInput2 !== undefined) {
        userInput2 = req.query.not_ingredients;
        not_ingredients = userInput2.split(',').map(item => item.trim());
    }

    let input_recipe = [];
    let input_recipe2 = [];

    //유저가 입력한 사용할 재료를 기반으로 음식검색
    for (let i = 0; i < ingredients.length; i++) {
        const searchRecipe = [];
        const results = await new Promise((resolve, reject) => {
            const value = ingredients[i];

            // 29번 반복된 배열을 생성
            const values = Array(29).fill(value);

            // 각 ingredient에 대해 조건을 나누어서 쿼리 생성
            const query = `
                SELECT *
                FROM ingredientData
                WHERE ${values.map((_, index) => `ingredient${index + 1} = ?`).join(' OR ')}
            `;

            conn.query(query, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
        for (result of results) {
            searchRecipe.push(result.ID);
        }
        input_recipe.push(searchRecipe);
    }
    const recipe1 = [];
    let countMap1 = {};

    //유저가 입력한 재료가 모두 들어가는지 검사
    input_recipe.forEach((subArr, subArrIndex) => {
        subArr.forEach(element => {
            // 요소가 이미 등장한 서브 배열을 기록
            if (!countMap1[element]) {
                countMap1[element] = new Set(); // 새로운 Set 생성
            }
            countMap1[element].add(subArrIndex); // 해당 서브 배열 인덱스를 추가
        });
    });

    //모두 등장한 레시피를 추출
    for (let element in countMap1) {
        if (countMap1[element].size === ingredients.length) {
            recipe1.push(parseInt(element));
        }
    }

    //유저가 입력한 사용하지 않을 재료를 기반으로 검색
    if (userInput2 !== undefined) {
        for (let i = 0; i < not_ingredients.length; i++) {
            const results = await new Promise((resolve, reject) => {
                const value = not_ingredients[i];

                // 29번 반복된 배열을 생성
                const values = Array(29).fill(value);

                // 각 ingredient에 대해 조건을 나누어서 쿼리 생성
                const query = `
                    SELECT *
                    FROM ingredientData
                    WHERE ${values.map((_, index) => `ingredient${index + 1} = ?`).join(' OR ')}
                `;

                conn.query(query, values, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
            for (result of results) {
                input_recipe2.push(result.ID);
            }
        }
        const recipe2 = [];

        //제외된 식재료가 포함된 경우 검색결과에서 제외
        for (recipe of recipe1) {
            if (!input_recipe2.includes(recipe)) {
                recipe2.push(recipe);
            }
        }

        //필터링된 레시피 id를 기반으로 레시피 검색
        const recipes = [];
        for (let i = 0; i < recipe2.length; i++) {
            const result = await new Promise((resolve, reject) => {
                conn.query(`SELECT * FROM recipe WHERE id = ${recipe2[i]}`, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result[0]);
                });
            });
            recipes.push(result);
        }
        res.json(recipes);
        //res.render('searchResults', { userIngredients: ingredients, not_ingredients: not_ingredients, recipes: recipes });
    }
    else {
        //사용하지 않을 재료를 입력하지 않은 경우
        //즉시 id를 기반으로 레시피 검색
        const recipes = [];
        for (let i = 0; i < recipe1.length; i++) {
            const result = await new Promise((resolve, reject) => {
                conn.query(`SELECT * FROM recipe WHERE id = ${recipe1[i]}`, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result[0]);
                });
            });
            recipes.push(result);
        }
        res.json({ recipes });
        //res.render('searchResults', { userIngredients: ingredients, not_ingredients: not_ingredients, recipes: recipes });
    }
});

// 겹친 재료 수를 계산하는 함수 (예시)
function calculateMatchScore(recipe, ingredients) {
    const recipeIngredients = recipe.Ingredients.split(',').map(item => item.trim());
    let matchedCount = 0;

    ingredients.forEach(ingredient => {
        if (recipeIngredients.includes(ingredient)) {
            matchedCount++;
        }
    });

    // 겹친 재료 개수만큼 점수 부여
    return matchedCount;
}

// 서버 시작
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});