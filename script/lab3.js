// @ts-ignore
document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('.matrix-size');
    select.addEventListener('change', function (ev) {
        var selectValue = ev.target.value;
        var matrixSize = parseInt(selectValue);
        var matrix = document.querySelector('.matrix');
        clearElement(matrix);
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
    // @ts-ignore
    var reachableMap = new Map();
    // @ts-ignore
    var counterreachableMap = new Map();
    button.addEventListener('click', function (ev) {
        var selectElement = document.querySelector('.matrix-size');
        var matrixSize = selectElement.value;
        var adjacencyMatrix = getAdjacencyMatrix(matrixSize);
        var mainMap = getMap(adjacencyMatrix, matrixSize);
        var newAdjacencyMatrix = getNewAdjacencyMatrix(adjacencyMatrix, matrixSize, mainMap);
        var rightIncidentMatrix = getRightIncidentMatrix(newAdjacencyMatrix, mainMap.size);
        console.log(newAdjacencyMatrix);
        showNewSystem(mainMap);
        showRightIncidentMatrix(rightIncidentMatrix, mainMap.size);
        console.log(reachableMap);
        console.log(counterreachableMap);
        console.log(mainMap);
    });
    function getNewAdjacencyMatrix(adjacencyMatrix, matrixSize, mainMap) {
        var newAdjacencyMatrix = getFilledMatrix(mainMap.size, '0');
        var _loop_1 = function (key) {
            // @ts-ignore
            var set = new Set(mainMap.get(key + 1));
            set.forEach(function (value) {
                for (var column = 0; column < matrixSize; column++) {
                    if (adjacencyMatrix[value - 1][column] === '1' && !set.has(column + 1)) {
                        var newColumn = findSubSystem(mainMap, column + 1);
                        newAdjacencyMatrix[key][newColumn] = '1';
                    }
                }
            });
        };
        for (var key = 0; key < mainMap.size; key++) {
            _loop_1(key);
        }
        return newAdjacencyMatrix;
    }
    function findSubSystem(mainMap, el) {
        var newColumn = -1;
        mainMap.forEach(function (mas, key) {
            // @ts-ignore
            var set = new Set(mas);
            if (set.has(el)) {
                newColumn = key - 1;
                return;
            }
        });
        return newColumn;
    }
    function showNewSystem(mainMap) {
        var newSystemWrapper = document.querySelector('.new-system-wrapper');
        clearElement(newSystemWrapper);
        var newNumbersHeader = document.createElement('h2');
        newNumbersHeader.textContent = "Подсистемы";
        newSystemWrapper.appendChild(newNumbersHeader);
        mainMap.forEach(function (value, key) {
            var row = document.createElement('div');
            row.innerHTML = "<span>\u041F\u043E\u0434\u0441\u0438\u0441\u0442\u0435\u043C\u0430 ".concat(key, "</span>");
            newSystemWrapper.appendChild(row);
            var rowMap = document.createElement('div');
            rowMap.innerHTML = '<span>Вершины (';
            value.forEach(function (val) {
                rowMap.innerHTML += "".concat(val, " ");
            });
            rowMap.innerHTML += ')</span>';
            newSystemWrapper.appendChild(rowMap);
        });
    }
    function getMap(adjacencyMatrix, matrixSize) {
        fillCounterreachableMap(matrixSize);
        // @ts-ignore
        var mainMap = new Map();
        // @ts-ignore
        var vertices = new Set();
        for (var i = 0; i < matrixSize; i++) {
            fillSubgraph(adjacencyMatrix, matrixSize, i);
        }
        var number = 1;
        var _loop_2 = function (key) {
            // @ts-ignore
            var subgraph = Array.from(reachableMap.get(key + 1)).filter(function (x) { return counterreachableMap.get(key + 1).has(x); });
            if (subgraph.filter(function (x) { return !vertices.has(x); }).length === 0) {
                return "continue";
            }
            mainMap.set(number++, subgraph.filter(function (x) { return !vertices.has(x); }));
            subgraph.forEach(function (value) {
                vertices.add(value);
            });
        };
        for (var key = 0; key < matrixSize; key++) {
            _loop_2(key);
        }
        return mainMap;
    }
    function fillSubgraph(adjacencyMatrix, matrixSize, row) {
        // @ts-ignore
        var reachableSet = new Set();
        reachableSet.add(row + 1);
        for (var column = 0; column < matrixSize; column++) {
            if (adjacencyMatrix[row][column] === '1') {
                reachableSet.add(column + 1);
                // console.log("Row: " + (row + 1) + " Column: " + (column + 1))
                counterreachableMap.get(column + 1).add(row + 1);
            }
        }
        // @ts-ignore
        var tempSet = new Set();
        while (reachableSet.size !== tempSet.size) {
            reachableSet.forEach(function (value) {
                tempSet.add(value);
            });
            tempSet.forEach(function (value) {
                for (var column = 0; column < matrixSize; column++) {
                    if (adjacencyMatrix[value - 1][column] === '1') {
                        reachableSet.add(column + 1);
                        counterreachableMap.get(column + 1).add(row + 1);
                    }
                }
            });
        }
        reachableMap.set(row + 1, reachableSet);
    }
    function fillCounterreachableMap(matrixSize) {
        for (var i = 0; i < matrixSize; i++) {
            // @ts-ignore
            var counterreachableSet = new Set();
            counterreachableSet.add(i + 1);
            counterreachableMap.set(i + 1, counterreachableSet);
        }
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
    // получить множество левых инциденций по матрице смежности
    function getLeftIncidentMatrix(adjacencyMatrix, matrixSize) {
        var arr = getFilledMatrix(matrixSize, null);
        for (var j = 0; j < matrixSize; j++) {
            for (var i = 0; i < matrixSize; i++) {
                var val = void 0;
                if (adjacencyMatrix[i][j] !== '0') {
                    var index = i;
                    val = ++index;
                }
                else {
                    val = '0';
                }
                arr[j][i] = val;
            }
        }
        return arr;
    }
});
