// @ts-ignore
document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('.matrix-size');
    select.addEventListener('change', function (ev) {
        var selectValue = ev.target.value;
        var matrixSize = parseInt(selectValue);
        var matrix = document.querySelector('.matrix');
        clearElement(matrix);
        var errorDiv = document.querySelector('.error');
        clearElement(errorDiv);
        for (var i = 0; i < matrixSize; i++) {
            var tr = document.createElement("tr");
            for (var j = 0; j < matrixSize; j++) {
                var td = document.createElement("td");
                var input = document.createElement('input');
                input.setAttribute("type", "number");
                input.setAttribute("min", "0");
                input.setAttribute("max", "1");
                input.setAttribute("value", "0");
                input.required = true;
                td.appendChild(input);
                tr.appendChild(td);
            }
            matrix.appendChild(tr);
        }
    });
    var button = document.querySelector('.btn');
    button.addEventListener('click', function (ev) {
        var errorDiv = document.querySelector('.error');
        clearElement(errorDiv);
        var selectElement = document.querySelector('.matrix-size');
        var matrixSize = selectElement.value;
        var adjacencyMatrix = getAdjacencyMatrix(matrixSize);
        if (checkForContours(adjacencyMatrix, matrixSize)) {
            var errorDiv_1 = document.querySelector('.error');
            errorDiv_1.innerHTML += "<span>" +
                "Граф имеет контуры" +
                " </span>";
        }
        else {
            var mapLevels = getMapLevels(adjacencyMatrix, matrixSize);
            var newAdjacencyMatrix = getNewAdjacencyMatrix(mapLevels, adjacencyMatrix, matrixSize);
            var rightIncidentMatrix = getRightIncidentMatrix(newAdjacencyMatrix, matrixSize);
            showNewNumbers(mapLevels);
            showRightIncidentMatrix(rightIncidentMatrix, matrixSize);
        }
    });
    function showNewNumbers(mapLevels) {
        var newNumbersWrapper = document.querySelector('.new-numbers-wrapper');
        clearElement(newNumbersWrapper);
        var newNumbersHeader = document.createElement('h2');
        newNumbersHeader.textContent = "Изменение нумерации";
        newNumbersWrapper.appendChild(newNumbersHeader);
        mapLevels.forEach(function (value, key) {
            var row = document.createElement('div');
            row.innerHTML = "<span>\u0418\u0435\u0440\u0430\u0440\u0445\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C ".concat(key, "</span>");
            newNumbersWrapper.appendChild(row);
            value.forEach(function (value, key) {
                var rowMap = document.createElement('div');
                rowMap.innerHTML = "<span>\u0421\u0442\u0430\u0440\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 \u0432\u0435\u0440\u0448\u0438\u043D\u044B - ".concat(key, ", \u043D\u043E\u0432\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 - ").concat(value, "</span>");
                newNumbersWrapper.appendChild(rowMap);
            });
        });
    }
    // получаем новую матрицу смежности
    function getNewAdjacencyMatrix(mapLevels, adjacencyMatrix, matrixSize) {
        var arr = getFilledMatrix(matrixSize, '0');
        var newRow = 0;
        var newColumn = 0;
        var _loop_1 = function (row) {
            var _loop_2 = function (column) {
                if (adjacencyMatrix[row][column] === '1') {
                    console.log("Старая строка");
                    console.log(row);
                    console.log("Старый столбец");
                    console.log(column);
                    mapLevels.forEach(function (map) {
                        if (map.get(row + 1) !== undefined) {
                            newRow = map.get(row + 1) - 1;
                        }
                        if (map.get(column + 1) !== undefined) {
                            newColumn = map.get(column + 1) - 1;
                        }
                    });
                    console.log("Новая строка");
                    console.log(newRow);
                    console.log("Новый столбец");
                    console.log(newColumn);
                    arr[newRow][newColumn] = '1';
                }
            };
            for (var column = 0; column < matrixSize; column++) {
                _loop_2(column);
            }
        };
        for (var row = 0; row < matrixSize; row++) {
            _loop_1(row);
        }
        return arr;
    }
    function showRightIncidentMatrix(matrix, matrixSize) {
        var rightIncidentMatrixWrapper = document.querySelector('.right-incident-matrix-wrapper');
        rightIncidentMatrixWrapper.innerHTML = '';
        var rightIncidentMatrixHeader = document.createElement('h2');
        rightIncidentMatrixHeader.textContent = "Множество правых инциденций";
        rightIncidentMatrixWrapper.appendChild(rightIncidentMatrixHeader);
        for (var i = 0; i < matrixSize; i++) {
            var row = document.createElement('div');
            row.className += "row";
            var rowVal = "";
            for (var j = 0; j < matrixSize; j++) {
                var val = matrix[i][j];
                rowVal += "".concat(val !== null && val !== '0' ? val : '', " ");
            }
            var index = i;
            row.innerHTML = "<span>G<sup>+</sup>(".concat(++index, ")</span> { ").concat(rowVal, "}");
            rightIncidentMatrixWrapper.appendChild(row);
        }
    }
    // получить множество правых инциденций по матрице смежности
    function getRightIncidentMatrix(adjacencyMatrix, matrixSize) {
        var arr = getFilledMatrix(matrixSize, null);
        for (var i = 0; i < matrixSize; i++) {
            for (var j = 0; j < matrixSize; j++) {
                var val = void 0;
                if (adjacencyMatrix[i][j] !== '0') {
                    var index = j;
                    val = ++index;
                }
                else {
                    val = '0';
                }
                arr[i][j] = val;
            }
        }
        return arr;
    }
    // введение порядковой функции
    function getMapLevels(adjacencyMatrix, matrixSize) {
        // @ts-ignore
        var mapLevels = new Map();
        // @ts-ignore
        var mainMap = new Map();
        var vertices = [];
        var newNumber = 1;
        var level = 0;
        var isVertixN0 = true;
        // @ts-ignore
        var map = new Map();
        for (var column = 0; column < matrixSize; column++) {
            for (var row = 0; row < matrixSize; row++) {
                if (adjacencyMatrix[row][column] === '1') {
                    isVertixN0 = false;
                    break;
                }
            }
            if (isVertixN0) {
                vertices.push(column);
                mainMap.set(column + 1, newNumber);
                map.set(column + 1, newNumber);
                newNumber++;
            }
            else {
                isVertixN0 = true;
            }
        }
        mapLevels.set(level, map);
        var pastLevel = level;
        level++;
        while (true) {
            // @ts-ignore
            var map_1 = new Map();
            console.log("Главная матрица");
            console.log(mapLevels);
            var _loop_3 = function (column) {
                // let tempMap = mapLevels.get(pastLevel)
                // let key = column
                // if (tempMap.has(++key) || vertices.some((element) => element == column)) {
                if (vertices.some(function (element) { return element == column; })) {
                    return "continue";
                }
                else {
                    // console.log("Столбец не из матрицы")
                    // console.log(column)
                    // console.log("tempMap")
                    // console.log(tempMap)
                    // console.log("mainMap")
                    // console.log(mainMap)
                    var isVertexLevel = true;
                    for (var row = 0; row < matrixSize; row++) {
                        if (adjacencyMatrix[row][column] === '1') {
                            var keyRow = row;
                            // if (!tempMap.has(keyRow + 1) && !mainMap.has(keyRow + 1)) {
                            if (!mainMap.has(keyRow + 1)) {
                                isVertexLevel = false;
                            }
                        }
                    }
                    if (isVertexLevel) {
                        vertices.push(column);
                        map_1.set(column + 1, newNumber);
                        // console.log("map")
                        // console.log(map)
                        newNumber++;
                    }
                    else {
                        isVertexLevel = true;
                    }
                }
            };
            for (var column = 0; column < matrixSize; column++) {
                _loop_3(column);
            }
            if (map_1.size === 0) {
                break;
            }
            map_1.forEach(function (value, key) {
                mainMap.set(key, value);
            });
            mapLevels.set(level, map_1);
            pastLevel = level;
            level++;
        }
        console.log(mapLevels);
        return mapLevels;
    }
    function getAdjacencyMatrix(matrixSize) {
        var matrix = document.querySelector('.matrix');
        var arr = getFilledMatrix(matrixSize, '0');
        var rows = matrix.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
            var row = rows.item(i);
            var inputs = row.getElementsByTagName('input');
            for (var j = 0; j < inputs.length; j++) {
                if (inputs.item(j).value !== '') {
                    arr[i][j] = inputs.item(j).value;
                }
            }
        }
        return arr;
    }
    // проверка графа на контуры (true - если есть контуры)
    function checkForContours(adjacencyMatrix, matrixSize) {
        for (var row = 0; row < matrixSize; row++) {
            for (var column = 0; column < matrixSize; column++) {
                if (adjacencyMatrix[row][column] === '1') {
                    var path = getPath(adjacencyMatrix, matrixSize, row, column);
                    if (path === null) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    // Получить путь в графе
    function getPath(adjacencyMatrix, matrixSize, firstRow, firstColumn) {
        var vertices = [];
        vertices.push(firstRow + 1, firstColumn + 1);
        // console.log("firstColumn")
        // console.log(firstColumn)
        var row = firstColumn;
        for (var column = 0; column < matrixSize; column++) {
            if (adjacencyMatrix[row][column] === '1') {
                // console.log(row)
                // console.log(column)
                var el = column;
                vertices.push(++el);
                // если в массиве вершин есть повторяющиеся элементы (то есть появился контур) возвращаем null
                if (hasDuplicates(vertices)) {
                    return null;
                }
                else {
                    row = column;
                    column = -1;
                }
            }
        }
        return vertices;
    }
    function hasDuplicates(arr) {
        // console.log(arr)
        arr.sort();
        // console.log("Отсортированный массив вершин")
        // console.log(arr)
        for (var i = 0; i < arr.length; i++) {
            var index = i;
            if (arr[i] === arr[++index]) {
                return true;
            }
        }
        return false;
    }
    function getFilledMatrix(matrixSize, value) {
        var arr = [];
        for (var i = 0; i < matrixSize; i++) {
            var subArr = [];
            for (var j = 0; j < matrixSize; j++) {
                subArr.push(value);
            }
            arr.push(subArr);
        }
        return arr;
    }
    function clearElement(element) {
        element.innerHTML = "";
    }
});
