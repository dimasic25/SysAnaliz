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
        var rightIncidentMatrix = getRightIncidentMatrix(adjacencyMatrix, matrixSize);
        console.log("Матрица правых инциденций");
        console.log(rightIncidentMatrix);
        var leftIncidentMatrix = getLeftIncidentMatrix(adjacencyMatrix, matrixSize);
        console.log("Матрица левых инциденций");
        console.log(leftIncidentMatrix);
        showLeftIncidentMatrix(leftIncidentMatrix, matrixSize);
        showRightIncidentMatrix(rightIncidentMatrix, matrixSize);
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
    function showLeftIncidentMatrix(matrix, matrixSize) {
        var leftIncidentMatrixWrapper = document.querySelector('.left-incident-matrix-wrapper');
        leftIncidentMatrixWrapper.innerHTML = '';
        var leftIncidentMatrixHeader = document.createElement('h2');
        leftIncidentMatrixHeader.textContent = "Множество левых инциденций";
        leftIncidentMatrixWrapper.appendChild(leftIncidentMatrixHeader);
        for (var i = 0; i < matrixSize; i++) {
            var row = document.createElement('div');
            row.className += "row";
            var rowVal = "";
            for (var j = 0; j < matrixSize; j++) {
                var val = matrix[i][j];
                rowVal += "".concat(val !== null && val !== '0' ? val : '', " ");
            }
            var index = i;
            row.innerHTML = "<span>G<sup>-</sup>(".concat(++index, ")</span> { ").concat(rowVal, "}");
            leftIncidentMatrixWrapper.appendChild(row);
        }
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
