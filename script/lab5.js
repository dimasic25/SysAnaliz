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
    button.addEventListener('click', function (ev) {
        var selectElement = document.querySelector('.matrix-size');
        var matrixSize = selectElement.value;
        var adjacencyMatrix = getAdjacencyMatrix(matrixSize);
        var rightIncidentSet = getRightIncidentMatrix(adjacencyMatrix, matrixSize);
        console.log(rightIncidentSet);
        var resultMatrix = getFilledMatrix(matrixSize, 0);
        for (var i = 1; i <= Number(matrixSize); i++) {
            var shortestPaths = getShortestPaths(i, rightIncidentSet, matrixSize);
            updateResultMatrix(resultMatrix, matrixSize, shortestPaths, i);
        }
        var absoluteCompact = getAbsoluteCompact(resultMatrix, matrixSize);
        console.log(absoluteCompact);
        var minCompact = Number(matrixSize) * (Number(matrixSize) - 1);
        console.log(minCompact);
        var relCompact = (absoluteCompact / minCompact) - 1;
        console.log(relCompact);
        var diametr = resultMatrix[0][0];
        for (var row = 0; row < Number(matrixSize); row++) {
            for (var column = 0; column < Number(matrixSize); column++) {
                if (resultMatrix[row][column] > diametr) {
                    diametr = resultMatrix[row][column];
                }
            }
        }
        showCompacts(absoluteCompact, diametr, relCompact);
    });
    function showCompacts(absoluteCompact, diametr, relCompact) {
        var answer = document.querySelector('.answer-wrapper');
        clearElement(answer);
        var answerHeader = document.createElement('h2');
        answerHeader.textContent = "Показатели компактности\n";
        answer.appendChild(answerHeader);
        var row = document.createElement('div');
        if (relCompact >= 0) {
            row.innerHTML = "<span>\u0410\u0431\u0441\u043E\u043B\u044E\u0442\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E\u0441\u0442\u044C ".concat(absoluteCompact, "</span> <br>") +
                "<span>\u041E\u0442\u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E\u0441\u0442\u044C ".concat(relCompact, "</span><br>") +
                "<span>\u0414\u0438\u0430\u043C\u0435\u0442\u0440 ".concat(diametr, "</span>");
        }
        else {
            row.innerHTML = '<span>Показатели компактности невозможно рассчитать</span> <br>' +
                "<span>\u0414\u0438\u0430\u043C\u0435\u0442\u0440 ".concat(diametr, "</span>");
        }
        answer.appendChild(row);
    }
    function getAbsoluteCompact(pathsMatrix, matrixSize) {
        var absoluteCompact = 0;
        for (var row = 0; row < matrixSize; row++) {
            for (var column = 0; column < matrixSize; column++) {
                if (row !== column) {
                    absoluteCompact += pathsMatrix[row][column];
                }
            }
        }
        return absoluteCompact;
    }
    function getShortestPaths(vertix, rightIncidentSet, matrixSize) {
        // @ts-ignore
        var indexMap = new Map();
        var index = 0;
        indexMap.set(index, [vertix]);
        // @ts-ignore
        var tagVertices = new Set();
        tagVertices.add(vertix);
        var tempVertices = indexMap.get(index);
        var vertices = [1];
        while (tagVertices.size < matrixSize && vertices.length !== 0) {
            tempVertices = indexMap.get(index);
            vertices = [];
            tempVertices.forEach(function (value) {
                for (var row = 0; row < matrixSize; row++) {
                    if (rightIncidentSet[row][value - 1] === value) {
                        if (!tagVertices.has(row + 1)) {
                            vertices.push(row + 1);
                        }
                        tagVertices.add(row + 1);
                    }
                }
            });
            indexMap.set(++index, vertices);
        }
        return indexMap;
    }
    function updateResultMatrix(resultMatrix, matrixSize, shortestPaths, index) {
        for (var row = 0; row < matrixSize; row++) {
            resultMatrix[row][index - 1] = findKey(shortestPaths, row + 1);
        }
    }
    function findKey(shortestPaths, value) {
        var val = -1;
        shortestPaths.forEach(function (array, key) {
            if (findElement(value, array)) {
                val = key;
                return;
            }
        });
        return val;
    }
    function findElement(element, array) {
        for (var index = 0; index < array.length; index++) {
            if (array[index] === element) {
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
});
