document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('.matrix-size');
    select.addEventListener('change', function (ev) {
        var selectValue = ev.target.value;
        var matrixSize = parseInt(selectValue);
        var matrix = document.querySelector('.matrix');
        matrix.innerHTML = "";
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
        console.log("Матрица смежности");
        console.log(adjacencyMatrix);
        console.log(checkForContours(adjacencyMatrix, matrixSize));
    });
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
        for (var row = firstColumn++; row < matrixSize; row++) {
            for (var column = 0; column < matrixSize; column++) {
                if (adjacencyMatrix[row][column] === '1') {
                    var el = column;
                    vertices.push(++el);
                    // если в массиве вершин есть повторяющиеся элементы (то есть появился контур) возвращаем null
                    if (hasDuplicates(vertices)) {
                        return null;
                    }
                    else {
                        row = column;
                        column = 0;
                    }
                }
            }
        }
        return vertices;
    }
    function hasDuplicates(arr) {
        console.log(arr);
        arr.sort();
        console.log("Отсортированный массив вершин");
        console.log(arr);
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
});
