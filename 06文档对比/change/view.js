// 输出文档对比内容

diffview = {
    buildView: function(params) {
        //上一文本内容
        var baseTextLines = params.baseTextLines;
        //新文本内容
        var newTextLines = params.newTextLines;
        //相同不同地点的校验代码
        var opcodes = params.opcodes;

        // console.log(baseTextLines)
        // console.log(newTextLines)
        // console.log(opcodes)

        //控制两文档窗口名称
        var baseTextName = params.baseTextName ? params.baseTextName : "文本内容一";
        var newTextName = params.newTextName ? params.newTextName : "文本内容二";
        //保留参数,用以控制文本长度
        var contextSize = undefined;
        //行列对比参数,控制是并联还是串联显示文档
        var inline = (params.viewType == 0 || params.viewType == 1) ? params.viewType : 0;

        if (baseTextLines == null)
            throw "baseTextLines is not defined.";
        if (newTextLines == null)
            throw "newTextLines is not defined.";
        if (!opcodes)
            throw "opcodes is not defined.";

        function celt(name, clazz) {
            var e = document.createElement(name);
            e.className = clazz;
            return e;
        }

        function telt(name, text) {
            var e = document.createElement(name);
            e.appendChild(document.createTextNode(text));
            return e;
        }

        function ctelt(name, clazz, text) {
            var e = document.createElement(name);
            e.className = clazz;
            e.appendChild(document.createTextNode(text));
            return e;
        }

        var tdata = document.createElement("thead");
        var node = document.createElement("tr");
        tdata.appendChild(node);
        if (inline) {
            node.appendChild(document.createElement("th"));
            node.appendChild(document.createElement("th"));
            node.appendChild(ctelt("th", "texttitle", baseTextName + " vs. " + newTextName));
        } else {
            node.appendChild(document.createElement("th"));
            node.appendChild(ctelt("th", "texttitle", baseTextName));
            node.appendChild(document.createElement("th"));
            node.appendChild(ctelt("th", "texttitle", newTextName));
        }
        tdata = [tdata];

        var rows = [];
        var node2;

        function addCells(row, tidx, tend, textLines, change) {
            if (tidx < tend) {
                row.appendChild(telt("th", (tidx + 1).toString()));
                row.appendChild(ctelt("td", change, textLines[tidx].replace(/\t/g, "\u00a0\u00a0\u00a0\u00a0")));
                return tidx + 1;
            } else {
                row.appendChild(document.createElement("th"));
                row.appendChild(celt("td", "empty"));
                return tidx;
            }
        }

        function addCellsInline(row, tidx, tidx2, textLines, change) {
            row.appendChild(telt("th", tidx == null ? "" : (tidx + 1).toString()));
            row.appendChild(telt("th", tidx2 == null ? "" : (tidx2 + 1).toString()));
            row.appendChild(ctelt("td", change, textLines[tidx != null ? tidx : tidx2].replace(/\t/g, "\u00a0\u00a0\u00a0\u00a0")));
        }

        for (var idx = 0; idx < opcodes.length; idx++) {
            code = opcodes[idx];
            change = code[0];
            var b = code[1];
            var be = code[2];
            var n = code[3];
            var ne = code[4];
            var rowcnt = Math.max(be - b, ne - n);
            var toprows = [];
            var botrows = [];
            for (var i = 0; i < rowcnt; i++) {
                // jump ahead if we've alredy provided leading context or if this is the first range
                if (contextSize && opcodes.length > 1 && ((idx > 0 && i == contextSize) || (idx == 0 && i == 0)) && change == "equal") {
                    var jump = rowcnt - ((idx == 0 ? 1 : 2) * contextSize);
                    if (jump > 1) {
                        toprows.push(node = document.createElement("tr"));

                        b += jump;
                        n += jump;
                        i += jump - 1;
                        node.appendChild(telt("th", "..."));
                        if (!inline) node.appendChild(ctelt("td", "skip", ""));
                        node.appendChild(telt("th", "..."));
                        node.appendChild(ctelt("td", "skip", ""));

                        // skip last lines if they're all equal
                        if (idx + 1 == opcodes.length) {
                            break;
                        } else {
                            continue;
                        }
                    }
                }

                toprows.push(node = document.createElement("tr"));
                if (inline) {
                    if (change == "insert") {
                        addCellsInline(node, null, n++, newTextLines, change);
                    } else if (change == "replace") {
                        botrows.push(node2 = document.createElement("tr"));
                        if (b < be) addCellsInline(node, b++, null, baseTextLines, "delete");
                        if (n < ne) addCellsInline(node2, null, n++, newTextLines, "insert");
                    } else if (change == "delete") {
                        addCellsInline(node, b++, null, baseTextLines, change);
                    } else {
                        // equal
                        addCellsInline(node, b++, n++, baseTextLines, change);
                    }
                } else {
                    b = addCells(node, b, be, baseTextLines, change);
                    n = addCells(node, n, ne, newTextLines, change);
                }
            }

            for (var i = 0; i < toprows.length; i++) rows.push(toprows[i]);
            for (var i = 0; i < botrows.length; i++) rows.push(botrows[i]);
        }

        rows.push(node = ctelt("th", "author", "技术支持 : "));
        node.setAttribute("colspan", inline ? 3 : 4);
        node.appendChild(node2 = telt("a", "北京菁华园信息技术有限公司"));
        node2.setAttribute("href", "http://tsinghuayuan.com/");

        tdata.push(node = document.createElement("tbody"));
        for (var idx in rows) rows.hasOwnProperty(idx) && node.appendChild(rows[idx]);

        node = celt("table", "diff" + (inline ? " inlinediff" : ""));
        for (var idx in tdata) tdata.hasOwnProperty(idx) && node.appendChild(tdata[idx]);
        return node;
    }
};
