class Grid {
    private _startPoint: Point;
    private _endPoint: Point;
    public _points: Point[][] = [];
    private _numCols: number;
    private _numRows: number;

    constructor(numCols: number, numRows: number) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._points = new Array();

        for (var i: number = 0; i < this._numCols; i++) {
            this._points[i] = new Array();
            for (var j: number = 0; j < this._numRows; j++) {
                this._points[i][j] = new Point(i, j);
            }
        }
    }

    public getPoint(x: number, y: number): Point {
        return this._points[x][y];
    }

    public setEndPoint(x: number, y: number): void {
        this._endPoint = this._points[x][y] as Point;
    }

    public setStartPoint(x: number, y: number): void {
        this._startPoint = this._points[x][y] as Point;
    }

    public setWalkable(x: number, y: number, value: boolean): void {
        this._points[x][y].walkable = value;
    }

    public getStartPoint(): Point {
        return this._startPoint;
    }

    public getEndPoint(): Point {
        return this._endPoint;
    }

    public getNumCols(): number {
        return this._numCols;
    }

    public getNumRows(): number {
        return this._numRows;
    }
}