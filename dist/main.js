(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.O.B === region.T.B)
	{
		return 'on line ' + region.O.B;
	}
	return 'on lines ' + region.O.B + ' through ' + region.T.B;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.az,
		impl.aH,
		impl.aF,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		p: func(record.p),
		P: record.P,
		L: record.L
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.p;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.P;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.L) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.az,
		impl.aH,
		impl.aF,
		function(sendToApp, initialModel) {
			var view = impl.aI;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.az,
		impl.aH,
		impl.aF,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.N && impl.N(sendToApp)
			var view = impl.aI;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.as);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.aG) && (_VirtualDom_doc.title = title = doc.aG);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.aB;
	var onUrlRequest = impl.aC;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		N: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.af === next.af
							&& curr.X === next.X
							&& curr.ac.a === next.ac.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		az: function(flags)
		{
			return A3(impl.az, flags, _Browser_getUrl(), key);
		},
		aI: impl.aI,
		aH: impl.aH,
		aF: impl.aF
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { ax: 'hidden', at: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { ax: 'mozHidden', at: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { ax: 'msHidden', at: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { ax: 'webkitHidden', at: 'webkitvisibilitychange' }
		: { ax: 'hidden', at: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aj: _Browser_getScene(),
		am: {
			ao: _Browser_window.pageXOffset,
			ap: _Browser_window.pageYOffset,
			an: _Browser_doc.documentElement.clientWidth,
			W: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		an: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		W: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aj: {
				an: node.scrollWidth,
				W: node.scrollHeight
			},
			am: {
				ao: node.scrollLeft,
				ap: node.scrollTop,
				an: node.clientWidth,
				W: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aj: _Browser_getScene(),
			am: {
				ao: x,
				ap: y,
				an: _Browser_doc.documentElement.clientWidth,
				W: _Browser_doc.documentElement.clientHeight
			},
			av: {
				ao: x + rect.left,
				ap: y + rect.top,
				an: rect.width,
				W: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.c);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.c);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{d: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, c: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {V: fragment, X: host, aa: path, ac: port_, af: protocol, ag: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$Model = F6(
	function (wordMeanings, mode, quizRange, wordsListRange, quizOptions, markedOptions) {
		return {C: markedOptions, H: mode, M: quizOptions, m: quizRange, I: wordMeanings, s: wordsListRange};
	});
var $author$project$Main$WordsList = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Data$data = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			1,
			_Utils_Tuple2('Abate', 'To decrease; reduce')),
			_Utils_Tuple2(
			2,
			_Utils_Tuple2('Abdicate', 'To give up a posiiton, right, or power')),
			_Utils_Tuple2(
			3,
			_Utils_Tuple2('Aberrant', 'Deviating from what is normal')),
			_Utils_Tuple2(
			4,
			_Utils_Tuple2('Abeyance', 'A temporary suppression or suspension')),
			_Utils_Tuple2(
			5,
			_Utils_Tuple2('Abject', 'Miserable; pitiful')),
			_Utils_Tuple2(
			6,
			_Utils_Tuple2('Abjure', 'To reject; abandon formally')),
			_Utils_Tuple2(
			7,
			_Utils_Tuple2('Abscission', 'The act of cutting; the natural seperation of a leaf or other part of a plant')),
			_Utils_Tuple2(
			8,
			_Utils_Tuple2('Abscond', 'To depart secretly')),
			_Utils_Tuple2(
			9,
			_Utils_Tuple2('Abstemious', 'Moderate in appetite')),
			_Utils_Tuple2(
			10,
			_Utils_Tuple2('Abstinence', 'The giving up of certain pleasures')),
			_Utils_Tuple2(
			11,
			_Utils_Tuple2('Abysmal', 'Very bad')),
			_Utils_Tuple2(
			12,
			_Utils_Tuple2('Accretion', 'Growth in size or increase in amount')),
			_Utils_Tuple2(
			13,
			_Utils_Tuple2('Accrue', 'To accumulate; grow by additions')),
			_Utils_Tuple2(
			14,
			_Utils_Tuple2('Adamant', 'Uncompromising; unyielding')),
			_Utils_Tuple2(
			15,
			_Utils_Tuple2('Adjunct', 'Something added, attached, or joined')),
			_Utils_Tuple2(
			16,
			_Utils_Tuple2('Admonish', 'To caution or reprimand')),
			_Utils_Tuple2(
			17,
			_Utils_Tuple2('Adulterate', 'To corrupt or make impure')),
			_Utils_Tuple2(
			18,
			_Utils_Tuple2('Aesthetic', 'Relating to beauty or art')),
			_Utils_Tuple2(
			19,
			_Utils_Tuple2('Affected', 'Pretentious, phony')),
			_Utils_Tuple2(
			20,
			_Utils_Tuple2('Affinity', 'Fondness; liking; similarity')),
			_Utils_Tuple2(
			21,
			_Utils_Tuple2('Aggrandize', 'To make larger or greater')),
			_Utils_Tuple2(
			22,
			_Utils_Tuple2('Aggregate', 'Amounting to a whole; total')),
			_Utils_Tuple2(
			23,
			_Utils_Tuple2('Alacrity', 'Cheerful willingness; eagerness; speed')),
			_Utils_Tuple2(
			24,
			_Utils_Tuple2('Alchemy', 'Medieval chemical philosophy based on chaning metal into gold; a seemingly magical power or process of transmutation')),
			_Utils_Tuple2(
			25,
			_Utils_Tuple2('Allay', 'To lessen; ease; soothe')),
			_Utils_Tuple2(
			26,
			_Utils_Tuple2('Alleviate', 'To relieve; improve partially')),
			_Utils_Tuple2(
			27,
			_Utils_Tuple2('Alloy', 'A combination; a mixture of two or more metals')),
			_Utils_Tuple2(
			28,
			_Utils_Tuple2('Allure', 'The power to entice by charm')),
			_Utils_Tuple2(
			29,
			_Utils_Tuple2('Amalgamate', 'To combine into a unified whole')),
			_Utils_Tuple2(
			30,
			_Utils_Tuple2('Ambiguous', 'Unclear or doubtful in meaning')),
			_Utils_Tuple2(
			31,
			_Utils_Tuple2('Ambivalence', 'The state of having conflicting emotional attitudes')),
			_Utils_Tuple2(
			32,
			_Utils_Tuple2('Ambrosia', 'Something delicious; the food of the gods')),
			_Utils_Tuple2(
			33,
			_Utils_Tuple2('Ameliorate', 'To improve')),
			_Utils_Tuple2(
			34,
			_Utils_Tuple2('Amenable', 'Agreeable; cooperative; suited')),
			_Utils_Tuple2(
			35,
			_Utils_Tuple2('Amenity', 'Something that increases comfort')),
			_Utils_Tuple2(
			36,
			_Utils_Tuple2('Amulet', 'Ornament worn as a charm against evil spirits')),
			_Utils_Tuple2(
			37,
			_Utils_Tuple2('Anachronism', 'Something out of the proper time')),
			_Utils_Tuple2(
			38,
			_Utils_Tuple2('Analgesic', 'Medication that reduces or eliminates pain')),
			_Utils_Tuple2(
			39,
			_Utils_Tuple2('Analogous', 'Comparable')),
			_Utils_Tuple2(
			40,
			_Utils_Tuple2('Anarchy', 'Absense of government; state of disorder')),
			_Utils_Tuple2(
			41,
			_Utils_Tuple2('Anodyne', 'Something that calms or soothes pain')),
			_Utils_Tuple2(
			42,
			_Utils_Tuple2('Anomalous', 'Irregular; deviating from the norm')),
			_Utils_Tuple2(
			43,
			_Utils_Tuple2('Antecedent', 'Something that comes before')),
			_Utils_Tuple2(
			44,
			_Utils_Tuple2('Antediluvian', 'Prehistoric')),
			_Utils_Tuple2(
			45,
			_Utils_Tuple2('Antipathy', 'Dislike; hostility')),
			_Utils_Tuple2(
			46,
			_Utils_Tuple2('Apathy', 'Indifference')),
			_Utils_Tuple2(
			47,
			_Utils_Tuple2('Apex', 'The highest point')),
			_Utils_Tuple2(
			48,
			_Utils_Tuple2('Apogee', 'The point in an orbit most distant from the body being orbited; the highest point')),
			_Utils_Tuple2(
			49,
			_Utils_Tuple2('Apothegm', 'A terse, witty saying')),
			_Utils_Tuple2(
			50,
			_Utils_Tuple2('Appease', 'To calm; pacify; placate')),
			_Utils_Tuple2(
			51,
			_Utils_Tuple2('Appeallation', 'Name')),
			_Utils_Tuple2(
			52,
			_Utils_Tuple2('Apposite', 'Strikingly appropriate and relevant')),
			_Utils_Tuple2(
			53,
			_Utils_Tuple2('Apprise', 'To inform')),
			_Utils_Tuple2(
			54,
			_Utils_Tuple2('Approbation', 'Praise; approval')),
			_Utils_Tuple2(
			55,
			_Utils_Tuple2('Appropriate', 'To take possession for one\'s own use; confiscate')),
			_Utils_Tuple2(
			56,
			_Utils_Tuple2('Apropos', 'Relevant')),
			_Utils_Tuple2(
			57,
			_Utils_Tuple2('Arabesque', 'Ornate design featuring intertwined curves; a ballet position in which one leg is extended in back while the other supports the weight of the body')),
			_Utils_Tuple2(
			58,
			_Utils_Tuple2('Archeology', 'The study of material evidence of past human life')),
			_Utils_Tuple2(
			59,
			_Utils_Tuple2('Ardor', 'Great emotion or passion')),
			_Utils_Tuple2(
			60,
			_Utils_Tuple2('Ardous', 'Extremely difficult; laborious')),
			_Utils_Tuple2(
			61,
			_Utils_Tuple2('Argot', 'A specialized vocabulary used by a group')),
			_Utils_Tuple2(
			62,
			_Utils_Tuple2('Arrest', 'To stop; to seize')),
			_Utils_Tuple2(
			63,
			_Utils_Tuple2('Artifact', 'Item made by human craft')),
			_Utils_Tuple2(
			64,
			_Utils_Tuple2('Artless', 'Guilesless; natural')),
			_Utils_Tuple2(
			65,
			_Utils_Tuple2('Ascetic', 'One who practices self-denial')),
			_Utils_Tuple2(
			66,
			_Utils_Tuple2('Asperity', 'Severity; harshness; irritability')),
			_Utils_Tuple2(
			67,
			_Utils_Tuple2('Aspersion', 'Slander; false rumor')),
			_Utils_Tuple2(
			68,
			_Utils_Tuple2('Assiduous', 'Diligent; hard-working')),
			_Utils_Tuple2(
			69,
			_Utils_Tuple2('Assuage', 'To make less severe')),
			_Utils_Tuple2(
			70,
			_Utils_Tuple2('Astringent', 'Harsh; severe')),
			_Utils_Tuple2(
			71,
			_Utils_Tuple2('Asylum', 'Place of refuge or shelter')),
			_Utils_Tuple2(
			72,
			_Utils_Tuple2('Atavism', 'Return of a trait after a period of absence')),
			_Utils_Tuple2(
			73,
			_Utils_Tuple2('Attenuate', 'To weaken')),
			_Utils_Tuple2(
			74,
			_Utils_Tuple2('Audacious', 'Bold; daring')),
			_Utils_Tuple2(
			75,
			_Utils_Tuple2('Austere', 'Stern; unadorned')),
			_Utils_Tuple2(
			76,
			_Utils_Tuple2('Autonomous', 'Self-governing; independent')),
			_Utils_Tuple2(
			77,
			_Utils_Tuple2('Avarice', 'Greed')),
			_Utils_Tuple2(
			78,
			_Utils_Tuple2('Aver', 'To affirm; declare to be true')),
			_Utils_Tuple2(
			79,
			_Utils_Tuple2('Avocation', 'Secondary occupation')),
			_Utils_Tuple2(
			80,
			_Utils_Tuple2('Avuncular', 'Like an uncle; benevolent and tolerant')),
			_Utils_Tuple2(
			81,
			_Utils_Tuple2('Axiomatic', 'Taken for granted')),
			_Utils_Tuple2(
			82,
			_Utils_Tuple2('Bacchanalian', 'Pertaining to riotous or drunken festivity; pertaining to revelry')),
			_Utils_Tuple2(
			83,
			_Utils_Tuple2('Banal', 'Commonplace; trite')),
			_Utils_Tuple2(
			84,
			_Utils_Tuple2('Banter', 'Playful conversation')),
			_Utils_Tuple2(
			85,
			_Utils_Tuple2('Bard', 'Poet')),
			_Utils_Tuple2(
			86,
			_Utils_Tuple2('Bawdy', 'Obscene')),
			_Utils_Tuple2(
			87,
			_Utils_Tuple2('Beatify', 'To sanctify; to bless; to ascribe virtue to')),
			_Utils_Tuple2(
			88,
			_Utils_Tuple2('Bedizen', 'To dress in a vulgar, showy manner')),
			_Utils_Tuple2(
			89,
			_Utils_Tuple2('Behemoth', 'Huge creature; anything very large and powerful')),
			_Utils_Tuple2(
			90,
			_Utils_Tuple2('Belie', 'To contradict; misinterpret; give a false impression')),
			_Utils_Tuple2(
			91,
			_Utils_Tuple2('Beneficent', 'Kindly; doing good')),
			_Utils_Tuple2(
			92,
			_Utils_Tuple2('Bifurcate', 'To divide into two parts')),
			_Utils_Tuple2(
			93,
			_Utils_Tuple2('Blandishment', 'Flattery')),
			_Utils_Tuple2(
			94,
			_Utils_Tuple2('Blase', 'Bored because of frequent indulgence; unconcerned')),
			_Utils_Tuple2(
			95,
			_Utils_Tuple2('Bolster', 'To give a boost to; prop up; support')),
			_Utils_Tuple2(
			96,
			_Utils_Tuple2('Bombastic', 'Pompous; using inflated language')),
			_Utils_Tuple2(
			97,
			_Utils_Tuple2('Boorish', 'Rude; insensitive')),
			_Utils_Tuple2(
			98,
			_Utils_Tuple2('Bovine', 'cowlike')),
			_Utils_Tuple2(
			99,
			_Utils_Tuple2('Brazen', 'Bold; shameless')),
			_Utils_Tuple2(
			100,
			_Utils_Tuple2('Broach', 'To mention for the first time')),
			_Utils_Tuple2(
			101,
			_Utils_Tuple2('Bucolic', 'Characteristic of the countryside; rustic; pastoral')),
			_Utils_Tuple2(
			102,
			_Utils_Tuple2('Burgeon', 'To flourish')),
			_Utils_Tuple2(
			103,
			_Utils_Tuple2('Burnish', 'To polish')),
			_Utils_Tuple2(
			104,
			_Utils_Tuple2('Buttress', 'To reinforce; support')),
			_Utils_Tuple2(
			105,
			_Utils_Tuple2('Cacophonous', 'Unpleasant or harsh-sounding')),
			_Utils_Tuple2(
			106,
			_Utils_Tuple2('Cadge', 'To beg; sponge')),
			_Utils_Tuple2(
			107,
			_Utils_Tuple2('Callous', 'Thick-skinned; insensitive')),
			_Utils_Tuple2(
			108,
			_Utils_Tuple2('Calumny', 'Flase and malicious accusation; slander')),
			_Utils_Tuple2(
			109,
			_Utils_Tuple2('Canard', 'False, deliberately misleading story')),
			_Utils_Tuple2(
			110,
			_Utils_Tuple2('Canon', 'An established principle; a basis or standard for judgement; a group of literary works')),
			_Utils_Tuple2(
			111,
			_Utils_Tuple2('Cant', 'Insincere talk; language of a particular group')),
			_Utils_Tuple2(
			112,
			_Utils_Tuple2('Cantankerous', 'Irritable; ill-humored')),
			_Utils_Tuple2(
			113,
			_Utils_Tuple2('Capricious', 'Fickle')),
			_Utils_Tuple2(
			114,
			_Utils_Tuple2('Captious', 'Faultfinding; intended to entrap, as in an argument')),
			_Utils_Tuple2(
			115,
			_Utils_Tuple2('Cardinal', 'Of foremost importance')),
			_Utils_Tuple2(
			116,
			_Utils_Tuple2('Carnal', 'Of the flesh or body; related to physical appetites')),
			_Utils_Tuple2(
			117,
			_Utils_Tuple2('Carping', 'To find fault; complain')),
			_Utils_Tuple2(
			118,
			_Utils_Tuple2('Cartography', 'Science of making maps')),
			_Utils_Tuple2(
			119,
			_Utils_Tuple2('Caste', 'Any of the hereditary social classes of Hindu society; social stratification')),
			_Utils_Tuple2(
			120,
			_Utils_Tuple2('Castigation', 'Punishment; chastisement; criticism')),
			_Utils_Tuple2(
			121,
			_Utils_Tuple2('Cataclysm', 'A violent upheaval that causes great destruction and change')),
			_Utils_Tuple2(
			122,
			_Utils_Tuple2('Catalyst', 'Something causing change')),
			_Utils_Tuple2(
			123,
			_Utils_Tuple2('Categorical', 'Absolute; without exception')),
			_Utils_Tuple2(
			124,
			_Utils_Tuple2('Caucus', 'Smaller group within an organization')),
			_Utils_Tuple2(
			125,
			_Utils_Tuple2('Causal', 'Involving a cause')),
			_Utils_Tuple2(
			126,
			_Utils_Tuple2('Caustic', 'Sarcastically biting; burning')),
			_Utils_Tuple2(
			127,
			_Utils_Tuple2('Celestial', 'Concerning the sky or heavens; sublime')),
			_Utils_Tuple2(
			128,
			_Utils_Tuple2('Centrifugal', 'Moving away from a center')),
			_Utils_Tuple2(
			129,
			_Utils_Tuple2('Centripetal', 'Moving or directed toward a center')),
			_Utils_Tuple2(
			130,
			_Utils_Tuple2('Champion', 'To defend or support')),
			_Utils_Tuple2(
			131,
			_Utils_Tuple2('Chasten', 'To correct by punishment or reproof; to restrain or subdue')),
			_Utils_Tuple2(
			132,
			_Utils_Tuple2('Chicanery', 'Trickery; fraud')),
			_Utils_Tuple2(
			133,
			_Utils_Tuple2('Chivalry', 'The qualities idealized by knighthood such as bravery and gallantry towards women')),
			_Utils_Tuple2(
			134,
			_Utils_Tuple2('Churlish', 'Rude; boorish')),
			_Utils_Tuple2(
			135,
			_Utils_Tuple2('Circuitous', 'Roundabout')),
			_Utils_Tuple2(
			136,
			_Utils_Tuple2('Clairvoyant', 'One who can predict the future; psychic')),
			_Utils_Tuple2(
			137,
			_Utils_Tuple2('Clamor', 'Noisy outcry')),
			_Utils_Tuple2(
			138,
			_Utils_Tuple2('Clique', 'A small, exclusive group')),
			_Utils_Tuple2(
			139,
			_Utils_Tuple2('Cloister', 'To confine; seclude')),
			_Utils_Tuple2(
			140,
			_Utils_Tuple2('Coagulate', 'Thicken; congeal')),
			_Utils_Tuple2(
			141,
			_Utils_Tuple2('Coalesce', 'To cause to become one')),
			_Utils_Tuple2(
			142,
			_Utils_Tuple2('Coda', 'A concluding part of a literary or musical composition; something that summarizes or concludes')),
			_Utils_Tuple2(
			143,
			_Utils_Tuple2('Codify', 'To sytematize')),
			_Utils_Tuple2(
			144,
			_Utils_Tuple2('Cognizant', 'Informed; conscious; aware')),
			_Utils_Tuple2(
			145,
			_Utils_Tuple2('Collage', 'Artistic composition of materials pasted over a surface; an assemblage of diverse elements')),
			_Utils_Tuple2(
			146,
			_Utils_Tuple2('Commensurate', 'Proportional')),
			_Utils_Tuple2(
			147,
			_Utils_Tuple2('Compendium', 'Brief, comprehensive summary')),
			_Utils_Tuple2(
			148,
			_Utils_Tuple2('Complacent', 'Self-satisfied')),
			_Utils_Tuple2(
			149,
			_Utils_Tuple2('Complaisant', 'Overly polite; willing to please; obliging')),
			_Utils_Tuple2(
			150,
			_Utils_Tuple2('Complement', 'Something that completes or makes up a whole')),
			_Utils_Tuple2(
			151,
			_Utils_Tuple2('Compliant', 'Yielding')),
			_Utils_Tuple2(
			152,
			_Utils_Tuple2('Compunction', 'Uneasiness caused by guilt')),
			_Utils_Tuple2(
			153,
			_Utils_Tuple2('Concave', 'Curving inward')),
			_Utils_Tuple2(
			154,
			_Utils_Tuple2('Conciliatory', 'Overcoming distrust or hostility')),
			_Utils_Tuple2(
			155,
			_Utils_Tuple2('Concoct', 'To invent')),
			_Utils_Tuple2(
			156,
			_Utils_Tuple2('Concomitant', 'Existing concurrently')),
			_Utils_Tuple2(
			157,
			_Utils_Tuple2('Condone', 'To overlook voluntarily; forgive')),
			_Utils_Tuple2(
			158,
			_Utils_Tuple2('Confound', 'To baffle; perplex; mix up')),
			_Utils_Tuple2(
			159,
			_Utils_Tuple2('Congenial', 'Similar in tastes and habits; friendly; suited to')),
			_Utils_Tuple2(
			160,
			_Utils_Tuple2('Conjugal', 'Pertaining to marriage agreement')),
			_Utils_Tuple2(
			161,
			_Utils_Tuple2('Connoisseur', 'A person possessing expert knowledge or training; a person of informed and discriminating taste')),
			_Utils_Tuple2(
			162,
			_Utils_Tuple2('Conscript', 'Person compulsorily enrolled for military service')),
			_Utils_Tuple2(
			163,
			_Utils_Tuple2('Consecrate', 'To declare sacred')),
			_Utils_Tuple2(
			164,
			_Utils_Tuple2('Contend', 'To assert')),
			_Utils_Tuple2(
			165,
			_Utils_Tuple2('Contentious', 'Quarrelsome; causing quarrels')),
			_Utils_Tuple2(
			166,
			_Utils_Tuple2('Contiguous', 'Touching; neighboring; connecting without a break')),
			_Utils_Tuple2(
			167,
			_Utils_Tuple2('Continence', 'Self-control; abstention from sexual activity')),
			_Utils_Tuple2(
			168,
			_Utils_Tuple2('Contrite', 'Very sorrowful for a wrong')),
			_Utils_Tuple2(
			169,
			_Utils_Tuple2('Contumacious', 'Disobedient; rebellious')),
			_Utils_Tuple2(
			170,
			_Utils_Tuple2('Conundrum', 'Riddle; puzzle with no solution')),
			_Utils_Tuple2(
			171,
			_Utils_Tuple2('Convention', 'Practice widely observed in a group; custom; accepted technique or device')),
			_Utils_Tuple2(
			172,
			_Utils_Tuple2('Converge', 'To approach; come together; tend to meet')),
			_Utils_Tuple2(
			173,
			_Utils_Tuple2('Convex', 'Curved outwards')),
			_Utils_Tuple2(
			174,
			_Utils_Tuple2('Convivial', 'Sociable')),
			_Utils_Tuple2(
			175,
			_Utils_Tuple2('Convoluted', 'Twisted; complicated')),
			_Utils_Tuple2(
			176,
			_Utils_Tuple2('Copious', 'Abundant; plentiful')),
			_Utils_Tuple2(
			177,
			_Utils_Tuple2('Coquette', 'Woman who flirts')),
			_Utils_Tuple2(
			178,
			_Utils_Tuple2('Cornucopia', 'Horn overflowing with fruit and grain; state of abundance')),
			_Utils_Tuple2(
			179,
			_Utils_Tuple2('Cosmology', 'Study of the universe as a totality; theory of the origin and structure of the universe')),
			_Utils_Tuple2(
			180,
			_Utils_Tuple2('Covert', 'Hidden; secret')),
			_Utils_Tuple2(
			181,
			_Utils_Tuple2('Covetous', 'Desiring something owned by another')),
			_Utils_Tuple2(
			182,
			_Utils_Tuple2('Cozen', 'To mislead by trick or fraud; deceive')),
			_Utils_Tuple2(
			183,
			_Utils_Tuple2('Craven', 'Cowardly')),
			_Utils_Tuple2(
			184,
			_Utils_Tuple2('Credence', 'Acceptance of something as true')),
			_Utils_Tuple2(
			185,
			_Utils_Tuple2('Credo', 'Statement of belief or principle; creed')),
			_Utils_Tuple2(
			186,
			_Utils_Tuple2('Daunt', 'To discourage; intimidate; dishearten')),
			_Utils_Tuple2(
			187,
			_Utils_Tuple2('Dearth', 'Scarcity')),
			_Utils_Tuple2(
			188,
			_Utils_Tuple2('Debauchery', 'Corruption')),
			_Utils_Tuple2(
			189,
			_Utils_Tuple2('Decorum', 'Proper behavior')),
			_Utils_Tuple2(
			190,
			_Utils_Tuple2('Defame', 'To malign; harm someone\'s reputation')),
			_Utils_Tuple2(
			191,
			_Utils_Tuple2('Default', 'To fail to act')),
			_Utils_Tuple2(
			192,
			_Utils_Tuple2('Deference', 'Respect; regard for another\'s wish')),
			_Utils_Tuple2(
			193,
			_Utils_Tuple2('Defunct', 'No longer existing')),
			_Utils_Tuple2(
			194,
			_Utils_Tuple2('Delineate', 'To represent or depict')),
			_Utils_Tuple2(
			195,
			_Utils_Tuple2('Demographic', 'Related to population balance')),
			_Utils_Tuple2(
			196,
			_Utils_Tuple2('Demotic', 'Pertaining to people')),
			_Utils_Tuple2(
			197,
			_Utils_Tuple2('Demur', 'To express doubt')),
			_Utils_Tuple2(
			198,
			_Utils_Tuple2('Denigrate', 'To slur someone\'s reputation')),
			_Utils_Tuple2(
			199,
			_Utils_Tuple2('Denizen', 'An inhabitant; a regular visitor')),
			_Utils_Tuple2(
			200,
			_Utils_Tuple2('Denouement', 'Outcome; unraveling of the plot of a play or work of literature')),
			_Utils_Tuple2(
			201,
			_Utils_Tuple2('Deride', 'To mock')),
			_Utils_Tuple2(
			202,
			_Utils_Tuple2('Derivative', 'Something derived; unoriginal')),
			_Utils_Tuple2(
			203,
			_Utils_Tuple2('Desiccate', 'To dry completely')),
			_Utils_Tuple2(
			204,
			_Utils_Tuple2('Desuetude', 'State of disuse')),
			_Utils_Tuple2(
			205,
			_Utils_Tuple2('Desultory', 'Random; disconnected; rambling')),
			_Utils_Tuple2(
			206,
			_Utils_Tuple2('Deterrent', 'Something that discourages or hinders')),
			_Utils_Tuple2(
			207,
			_Utils_Tuple2('Detraction', 'The act of taking away; derogatory comment on a person\'s character')),
			_Utils_Tuple2(
			208,
			_Utils_Tuple2('Diaphanous', 'Transparent; fine-textured; insubstantial; vague')),
			_Utils_Tuple2(
			209,
			_Utils_Tuple2('Diatribe', 'Bitter verbal attack')),
			_Utils_Tuple2(
			210,
			_Utils_Tuple2('Dichotomy', 'Division into two usually contradictory parts')),
			_Utils_Tuple2(
			211,
			_Utils_Tuple2('Diffidence', 'Shyness; lack of confidence')),
			_Utils_Tuple2(
			212,
			_Utils_Tuple2('Diffuse', 'To spread out')),
			_Utils_Tuple2(
			213,
			_Utils_Tuple2('Digression', 'Act of straying from the main point')),
			_Utils_Tuple2(
			214,
			_Utils_Tuple2('Dirge', 'Funeral Hymn')),
			_Utils_Tuple2(
			215,
			_Utils_Tuple2('Disabuse', 'To free from a misconception')),
			_Utils_Tuple2(
			216,
			_Utils_Tuple2('Discerning', 'Perceptive; exhibiting keen insight and good judgement')),
			_Utils_Tuple2(
			217,
			_Utils_Tuple2('Discomfit', 'To make uneasy; disconcert')),
			_Utils_Tuple2(
			218,
			_Utils_Tuple2('Discordant', 'Not in tune')),
			_Utils_Tuple2(
			219,
			_Utils_Tuple2('Discredit', 'To dishonor; disgrace; cause to be doubted')),
			_Utils_Tuple2(
			220,
			_Utils_Tuple2('Discrepancy', 'Difference between')),
			_Utils_Tuple2(
			221,
			_Utils_Tuple2('Discrete', 'Constituting a seperate thing; distinct')),
			_Utils_Tuple2(
			222,
			_Utils_Tuple2('Discretion', 'Quality of showing self-restraint in speech or actions; circumspection; freedom to act on one\'s own')),
			_Utils_Tuple2(
			223,
			_Utils_Tuple2('Disingenuous', 'Not candid; crafty')),
			_Utils_Tuple2(
			224,
			_Utils_Tuple2('Disinterested', 'Unprejudiced; objective')),
			_Utils_Tuple2(
			225,
			_Utils_Tuple2('Disjointed', 'Lacking order or coherence; dislocated')),
			_Utils_Tuple2(
			226,
			_Utils_Tuple2('Dismiss', 'Put away from consideration; reject')),
			_Utils_Tuple2(
			227,
			_Utils_Tuple2('Disparage', 'To belittle')),
			_Utils_Tuple2(
			228,
			_Utils_Tuple2('Disparate', 'Dissimilar')),
			_Utils_Tuple2(
			229,
			_Utils_Tuple2('Dissemble', 'To pretend; disguise one\'s motives')),
			_Utils_Tuple2(
			230,
			_Utils_Tuple2('Disseminate', 'To spread; scatter; disperse')),
			_Utils_Tuple2(
			231,
			_Utils_Tuple2('Dissident', 'Person who disagrees about beliefs, etc')),
			_Utils_Tuple2(
			232,
			_Utils_Tuple2('Dissolution', 'Disintegration; debauchery')),
			_Utils_Tuple2(
			233,
			_Utils_Tuple2('Dissonance', 'Discord; lack of harmony')),
			_Utils_Tuple2(
			234,
			_Utils_Tuple2('Distend', 'To expand; swell out')),
			_Utils_Tuple2(
			235,
			_Utils_Tuple2('Distill', 'Extract the essential elements')),
			_Utils_Tuple2(
			236,
			_Utils_Tuple2('Distrait', 'Inattentive; preoccupied')),
			_Utils_Tuple2(
			237,
			_Utils_Tuple2('Diverge', 'To vary; go in different directions from the same point')),
			_Utils_Tuple2(
			238,
			_Utils_Tuple2('Divest', 'To strip; deprive; rid')),
			_Utils_Tuple2(
			239,
			_Utils_Tuple2('Divulge', 'To make known something that is secret')),
			_Utils_Tuple2(
			240,
			_Utils_Tuple2('Doctrinaire', 'Relating to a person who cannot compromise about points of theory or doctrine; dogmatic; unyielding')),
			_Utils_Tuple2(
			241,
			_Utils_Tuple2('Document', 'To provide with written evidence to support')),
			_Utils_Tuple2(
			242,
			_Utils_Tuple2('Doggerel', 'Poor verse')),
			_Utils_Tuple2(
			243,
			_Utils_Tuple2('Dogmatic', 'Stating opinions without proof')),
			_Utils_Tuple2(
			244,
			_Utils_Tuple2('Dormant', 'Inactive')),
			_Utils_Tuple2(
			245,
			_Utils_Tuple2('Dross', 'Waste; worthless matter; trivial matter')),
			_Utils_Tuple2(
			246,
			_Utils_Tuple2('Dupe', 'To deceive; trick')),
			_Utils_Tuple2(
			247,
			_Utils_Tuple2('Ebullient', 'Exhilarated; enthusiastic')),
			_Utils_Tuple2(
			248,
			_Utils_Tuple2('Eclectic', 'Selecting from various sources')),
			_Utils_Tuple2(
			249,
			_Utils_Tuple2('Effervesence', 'State of high spirits or liveliness; the process of bubbling as gas escapes')),
			_Utils_Tuple2(
			250,
			_Utils_Tuple2('Effete', 'Depleted of vitality; overrefined; decadent')),
			_Utils_Tuple2(
			251,
			_Utils_Tuple2('Efficacy', 'Efficiency; effectiveness')),
			_Utils_Tuple2(
			252,
			_Utils_Tuple2('Effrontery', 'Shameless boldness; presumptuousness')),
			_Utils_Tuple2(
			253,
			_Utils_Tuple2('Egoism', 'The tendency to see things in relation to oneself; self-centeredness')),
			_Utils_Tuple2(
			254,
			_Utils_Tuple2('Egotistical', 'Excessively self-centered; conceited')),
			_Utils_Tuple2(
			255,
			_Utils_Tuple2('Elegy', 'A poem or song expressing lamentation')),
			_Utils_Tuple2(
			256,
			_Utils_Tuple2('Elicit', 'To provoke; draw out')),
			_Utils_Tuple2(
			257,
			_Utils_Tuple2('Elixir', 'A substance believed to have the power to cure ills')),
			_Utils_Tuple2(
			258,
			_Utils_Tuple2('Elysian', 'Blissful; delightful')),
			_Utils_Tuple2(
			259,
			_Utils_Tuple2('Emaciated', 'Thin and wasted')),
			_Utils_Tuple2(
			260,
			_Utils_Tuple2('Embellish', 'To adorn; decorate; enhance; make more attractive by adding details')),
			_Utils_Tuple2(
			261,
			_Utils_Tuple2('Emollient', 'Soothing; mollifying')),
			_Utils_Tuple2(
			262,
			_Utils_Tuple2('Empirical', 'Derived from observation or experiment')),
			_Utils_Tuple2(
			263,
			_Utils_Tuple2('Emulate', 'To imitate; copy')),
			_Utils_Tuple2(
			264,
			_Utils_Tuple2('Encomium', 'A formal expression of praise')),
			_Utils_Tuple2(
			265,
			_Utils_Tuple2('Endemic', 'Inherent; belonging to an area')),
			_Utils_Tuple2(
			266,
			_Utils_Tuple2('Enervate', 'To weaken')),
			_Utils_Tuple2(
			267,
			_Utils_Tuple2('Engender', 'To cuase; produce')),
			_Utils_Tuple2(
			268,
			_Utils_Tuple2('Enhance', 'To increase; improve')),
			_Utils_Tuple2(
			269,
			_Utils_Tuple2('Entomology', 'The scientific study of insects')),
			_Utils_Tuple2(
			270,
			_Utils_Tuple2('Enunciate', 'To pronounce clearly')),
			_Utils_Tuple2(
			271,
			_Utils_Tuple2('Ephemeral', 'Short-lived; fleeting')),
			_Utils_Tuple2(
			272,
			_Utils_Tuple2('Epistemology', 'Branch of philosophy that examines the nature of knowledge')),
			_Utils_Tuple2(
			273,
			_Utils_Tuple2('Equable', 'Steady; unvarying; serene')),
			_Utils_Tuple2(
			274,
			_Utils_Tuple2('Equanimity', 'Compsure; calmness')),
			_Utils_Tuple2(
			275,
			_Utils_Tuple2('Equivocate', 'To intentionally use vague language')),
			_Utils_Tuple2(
			276,
			_Utils_Tuple2('Errant', 'Mistaken; straying from the proper course')),
			_Utils_Tuple2(
			277,
			_Utils_Tuple2('Erudite', 'Learned; scholarly')),
			_Utils_Tuple2(
			278,
			_Utils_Tuple2('Esoteric', 'Hard to understand; known only to a few')),
			_Utils_Tuple2(
			279,
			_Utils_Tuple2('Essay', 'To make an attempt; subject to a test')),
			_Utils_Tuple2(
			280,
			_Utils_Tuple2('Estimable', 'Admirable; possible to estimate')),
			_Utils_Tuple2(
			281,
			_Utils_Tuple2('Ethnocentric', 'Based on the attitude that one\'s group is superior')),
			_Utils_Tuple2(
			282,
			_Utils_Tuple2('Etiology', 'Causes or origins')),
			_Utils_Tuple2(
			283,
			_Utils_Tuple2('Etymology', 'Origin and history of a word')),
			_Utils_Tuple2(
			284,
			_Utils_Tuple2('Eugenics', 'Study of factors that influence the hereditary qualities of the human race and ways to improve these qualities')),
			_Utils_Tuple2(
			285,
			_Utils_Tuple2('Eulogy', 'High praise, especially of a person who has recently died')),
			_Utils_Tuple2(
			286,
			_Utils_Tuple2('Euphenism', 'Use of agreeable or inoffensive language in place of unpleasant or offensive language')),
			_Utils_Tuple2(
			287,
			_Utils_Tuple2('Euphoria', 'A feeling of extreme happiness')),
			_Utils_Tuple2(
			288,
			_Utils_Tuple2('Euthanasia', 'Mercy killing')),
			_Utils_Tuple2(
			289,
			_Utils_Tuple2('Evince', 'To show plainly; be an indication of')),
			_Utils_Tuple2(
			290,
			_Utils_Tuple2('Evocative', 'Tending to call to mind or produce a reaction')),
			_Utils_Tuple2(
			291,
			_Utils_Tuple2('Exacerbate', 'To aggravate; make worse')),
			_Utils_Tuple2(
			292,
			_Utils_Tuple2('Exact', 'To force the payment of; demand and obtain by authority')),
			_Utils_Tuple2(
			293,
			_Utils_Tuple2('Exculpate', 'To clear of blame; vindicate')),
			_Utils_Tuple2(
			294,
			_Utils_Tuple2('Execrable', 'Detestable; abhorrent')),
			_Utils_Tuple2(
			295,
			_Utils_Tuple2('Exhort', 'To urge by strong appeals')),
			_Utils_Tuple2(
			296,
			_Utils_Tuple2('Exigency', 'Crisis; urgent requirements')),
			_Utils_Tuple2(
			297,
			_Utils_Tuple2('Existential', 'Having to do with existence; based on experience; having to do with the philosophy of existenialism')),
			_Utils_Tuple2(
			298,
			_Utils_Tuple2('Exorcise', 'To expel evil spirits; free from bad influences')),
			_Utils_Tuple2(
			299,
			_Utils_Tuple2('Expatiate', 'To speak or write at length')),
			_Utils_Tuple2(
			300,
			_Utils_Tuple2('Expatriate', 'To send into exile')),
			_Utils_Tuple2(
			301,
			_Utils_Tuple2('Expiate', 'To atone for')),
			_Utils_Tuple2(
			302,
			_Utils_Tuple2('Explicate', 'To explain; interpret; clarify')),
			_Utils_Tuple2(
			303,
			_Utils_Tuple2('Expository', 'Explanatory')),
			_Utils_Tuple2(
			304,
			_Utils_Tuple2('Extant', 'In existence; not lost')),
			_Utils_Tuple2(
			305,
			_Utils_Tuple2('extemporaneous', 'Unrehearsed')),
			_Utils_Tuple2(
			306,
			_Utils_Tuple2('Extirpate', 'To root up; to destroy')),
			_Utils_Tuple2(
			307,
			_Utils_Tuple2('Extraneous', 'Not essential')),
			_Utils_Tuple2(
			308,
			_Utils_Tuple2('Extrapolation', 'The act of estimation by projecting known information')),
			_Utils_Tuple2(
			309,
			_Utils_Tuple2('Extrinsic', 'Not inherent or essential')),
			_Utils_Tuple2(
			310,
			_Utils_Tuple2('Facetious', 'Humorous')),
			_Utils_Tuple2(
			311,
			_Utils_Tuple2('Facilitate', 'To make less difficult')),
			_Utils_Tuple2(
			312,
			_Utils_Tuple2('Factotum', 'A person who does all sorts of work; a handyman')),
			_Utils_Tuple2(
			313,
			_Utils_Tuple2('Fallacious', 'Based on a false idea or fact; misleading')),
			_Utils_Tuple2(
			314,
			_Utils_Tuple2('Fallow', 'Plowed but not sowed; uncultivated')),
			_Utils_Tuple2(
			315,
			_Utils_Tuple2('Fatuous', 'Foolishly self-satisfied')),
			_Utils_Tuple2(
			316,
			_Utils_Tuple2('Fauna', 'Animals of a period or region')),
			_Utils_Tuple2(
			317,
			_Utils_Tuple2('Fawning', 'Seeking favor by flattering')),
			_Utils_Tuple2(
			318,
			_Utils_Tuple2('Felicitous', 'Suitably expressed; appropriate; well chosen')),
			_Utils_Tuple2(
			319,
			_Utils_Tuple2('Feral', 'Existing in a wild or untamed state')),
			_Utils_Tuple2(
			320,
			_Utils_Tuple2('Fervor', 'Warmth and intensity of emotion')),
			_Utils_Tuple2(
			321,
			_Utils_Tuple2('Fetid', 'Having a bad smell')),
			_Utils_Tuple2(
			322,
			_Utils_Tuple2('Fetter', 'To bind; confine')),
			_Utils_Tuple2(
			323,
			_Utils_Tuple2('Fiat', 'Arbitrary order; authorization')),
			_Utils_Tuple2(
			324,
			_Utils_Tuple2('Fidelity', 'Loyalty; exact correspondence')),
			_Utils_Tuple2(
			325,
			_Utils_Tuple2('Filibuster', 'Use of obstructive tactics in a legislature to block passage of a law')),
			_Utils_Tuple2(
			326,
			_Utils_Tuple2('Finesse', 'To handle with a deceptive or evasive strategy; to use finesse, that is, refinement in performance')),
			_Utils_Tuple2(
			327,
			_Utils_Tuple2('Fissure', 'Crevice')),
			_Utils_Tuple2(
			328,
			_Utils_Tuple2('Flag', 'To droop; grow weak')),
			_Utils_Tuple2(
			329,
			_Utils_Tuple2('Fledgling', 'Beginner; novice')),
			_Utils_Tuple2(
			330,
			_Utils_Tuple2('Flora', 'Plants of a region or era')),
			_Utils_Tuple2(
			331,
			_Utils_Tuple2('Florid', 'Ruddy; reddish; flowery')),
			_Utils_Tuple2(
			332,
			_Utils_Tuple2('Flourish', 'An embellishment or ornamentation')),
			_Utils_Tuple2(
			333,
			_Utils_Tuple2('Flout', 'To treat scornfully')),
			_Utils_Tuple2(
			334,
			_Utils_Tuple2('Flux', 'Flowing; a continuous moving')),
			_Utils_Tuple2(
			335,
			_Utils_Tuple2('Foment', 'To incite; arouse')),
			_Utils_Tuple2(
			336,
			_Utils_Tuple2('Forbearance', 'Patience')),
			_Utils_Tuple2(
			337,
			_Utils_Tuple2('Forestall', 'To prevent; delay')),
			_Utils_Tuple2(
			338,
			_Utils_Tuple2('Formidable', 'Menacing; threatening')),
			_Utils_Tuple2(
			339,
			_Utils_Tuple2('Forswear', 'To renounce; repudiate')),
			_Utils_Tuple2(
			340,
			_Utils_Tuple2('Founder', 'To sink; fail; collapse')),
			_Utils_Tuple2(
			341,
			_Utils_Tuple2('Fracas', 'A loud quarrel; brawl')),
			_Utils_Tuple2(
			342,
			_Utils_Tuple2('Fractious', 'Quarrelsome; unruly; rebellious')),
			_Utils_Tuple2(
			343,
			_Utils_Tuple2('Fresco', 'A painting done on plaster')),
			_Utils_Tuple2(
			344,
			_Utils_Tuple2('Frieze', 'Ornamental band on a wall')),
			_Utils_Tuple2(
			345,
			_Utils_Tuple2('Froward', 'Stubbornly contrary; obstinately disobedient')),
			_Utils_Tuple2(
			346,
			_Utils_Tuple2('Frugality', 'Thrift')),
			_Utils_Tuple2(
			347,
			_Utils_Tuple2('Fulminate', 'To attack loudly; denounce')),
			_Utils_Tuple2(
			348,
			_Utils_Tuple2('Fulsome', 'So excessive as to be disgusting')),
			_Utils_Tuple2(
			349,
			_Utils_Tuple2('Fusion', 'Union; synthesis')),
			_Utils_Tuple2(
			350,
			_Utils_Tuple2('Futile', 'Ineffective; useless; fruitless')),
			_Utils_Tuple2(
			351,
			_Utils_Tuple2('Gainsay', 'To deny; dispute; oppose')),
			_Utils_Tuple2(
			352,
			_Utils_Tuple2('Gambol', 'To frolic; leap playfully')),
			_Utils_Tuple2(
			353,
			_Utils_Tuple2('Garrulous', 'Very talkative; wordy')),
			_Utils_Tuple2(
			354,
			_Utils_Tuple2('Gauche', 'Coarse and uncouth; clumsy')),
			_Utils_Tuple2(
			355,
			_Utils_Tuple2('Geniality', 'Cheerfulness; kindliness; sociability')),
			_Utils_Tuple2(
			356,
			_Utils_Tuple2('Gerrymander', 'To divide an area into voting districts in a way that favors a political party')),
			_Utils_Tuple2(
			357,
			_Utils_Tuple2('Glib', 'Fluent in an insincere way; offhand')),
			_Utils_Tuple2(
			358,
			_Utils_Tuple2('goad', 'To prod; urge on')),
			_Utils_Tuple2(
			359,
			_Utils_Tuple2('Gossamer', 'Sheer; light and delicate, like cobwebs')),
			_Utils_Tuple2(
			360,
			_Utils_Tuple2('Gouge', 'To tear out; scoop out; overcharge')),
			_Utils_Tuple2(
			361,
			_Utils_Tuple2('Grandiloquent', 'Pompous; bombastic')),
			_Utils_Tuple2(
			362,
			_Utils_Tuple2('Gregarious', 'Sociable')),
			_Utils_Tuple2(
			363,
			_Utils_Tuple2('Grouse', 'To complain')),
			_Utils_Tuple2(
			364,
			_Utils_Tuple2('Guileless', 'Free of cunning or deceit; artless')),
			_Utils_Tuple2(
			365,
			_Utils_Tuple2('Guise', 'Outward appearance; false appearance; pretense')),
			_Utils_Tuple2(
			366,
			_Utils_Tuple2('Gullible', 'Easily deceived')),
			_Utils_Tuple2(
			367,
			_Utils_Tuple2('Gustatory', 'Affecting the sense of taste')),
			_Utils_Tuple2(
			368,
			_Utils_Tuple2('Halcyon', 'Calm and peaceful; happy; golden; prosperous')),
			_Utils_Tuple2(
			369,
			_Utils_Tuple2('Hallowed', 'Holy; sacred')),
			_Utils_Tuple2(
			370,
			_Utils_Tuple2('Harrangue', 'Long, pompous speech; tirade')),
			_Utils_Tuple2(
			371,
			_Utils_Tuple2('Harrowing', 'Extremely distressing; terrifying')),
			_Utils_Tuple2(
			372,
			_Utils_Tuple2('Herbivorous', 'Relating to a herbivore, an animal that feeds mainly on plants')),
			_Utils_Tuple2(
			373,
			_Utils_Tuple2('Hermetic', 'Tightly sealed; magical')),
			_Utils_Tuple2(
			374,
			_Utils_Tuple2('Heterodox', 'Unorthodox; not widely accepted')),
			_Utils_Tuple2(
			375,
			_Utils_Tuple2('Hieroglyphics', 'A system of writing in which pictorial symbols represent meaning or sounds; writing or symbols that are difficult to decipher; the symbols used in advanced mathematics')),
			_Utils_Tuple2(
			376,
			_Utils_Tuple2('Hirsute', 'Covered with hair')),
			_Utils_Tuple2(
			377,
			_Utils_Tuple2('Histrionic', 'Relating to exaggerated emotional behavior calculated for effect; theatrical arts or performances')),
			_Utils_Tuple2(
			378,
			_Utils_Tuple2('Homeostasis', 'Automatic maintenance by an organsim of normal temperature, chemical balance, etc within itself')),
			_Utils_Tuple2(
			379,
			_Utils_Tuple2('Homily', 'Sermon; tedious moralizing lecture; platitude')),
			_Utils_Tuple2(
			380,
			_Utils_Tuple2('Homogenous', 'Composed of identical parts; uniform in composition')),
			_Utils_Tuple2(
			381,
			_Utils_Tuple2('Hyperbole', 'Purposeful exaggeration for effect')),
			_Utils_Tuple2(
			382,
			_Utils_Tuple2('Iconoclastic', 'Attacking cherished traditions')),
			_Utils_Tuple2(
			383,
			_Utils_Tuple2('Ideological', 'Relating to ideology, the set of ideas that form the basis of a political or economic system')),
			_Utils_Tuple2(
			384,
			_Utils_Tuple2('Idolatry', 'Idol worship; blind or excessive devotion')),
			_Utils_Tuple2(
			385,
			_Utils_Tuple2('Igneous', 'Produced by fire; volcanic')),
			_Utils_Tuple2(
			386,
			_Utils_Tuple2('Imbroglio', 'Complicated situation; an entanglement')),
			_Utils_Tuple2(
			387,
			_Utils_Tuple2('Immutable', 'Unchangeable')),
			_Utils_Tuple2(
			388,
			_Utils_Tuple2('Impassive', 'Showing no emotions')),
			_Utils_Tuple2(
			389,
			_Utils_Tuple2('Impecunious', 'Poor; having no money')),
			_Utils_Tuple2(
			390,
			_Utils_Tuple2('Impede', 'To hinder; block')),
			_Utils_Tuple2(
			391,
			_Utils_Tuple2('Impermeable', 'Impossible to penetrate')),
			_Utils_Tuple2(
			392,
			_Utils_Tuple2('Imperturbable', 'Not easily disturbed')),
			_Utils_Tuple2(
			393,
			_Utils_Tuple2('Impervious', 'Impossible to penetrate; incapable of being affected')),
			_Utils_Tuple2(
			394,
			_Utils_Tuple2('Impinge', 'To strike; encroach')),
			_Utils_Tuple2(
			395,
			_Utils_Tuple2('Implacable', 'Inflexible; incapable of being pleased')),
			_Utils_Tuple2(
			396,
			_Utils_Tuple2('Implausible', 'Unlikely; unbelievable')),
			_Utils_Tuple2(
			397,
			_Utils_Tuple2('Implict', 'Implied; understood but not stated')),
			_Utils_Tuple2(
			398,
			_Utils_Tuple2('Implode', 'Collapse inward violently')),
			_Utils_Tuple2(
			399,
			_Utils_Tuple2('Imprecation', 'Curse')),
			_Utils_Tuple2(
			400,
			_Utils_Tuple2('Impute', 'To relate a particular cause or source; attribute the fault to; assign as a characteristic')),
			_Utils_Tuple2(
			401,
			_Utils_Tuple2('Inadvertently', 'Carelessly; unintentionally')),
			_Utils_Tuple2(
			402,
			_Utils_Tuple2('Incarnate', 'Having bodily form')),
			_Utils_Tuple2(
			403,
			_Utils_Tuple2('Inchoate', 'Imperfectly formed or formulated')),
			_Utils_Tuple2(
			404,
			_Utils_Tuple2('Incongruity', 'State of not fitting')),
			_Utils_Tuple2(
			405,
			_Utils_Tuple2('Inconsequential', 'Insignificant; unimportant')),
			_Utils_Tuple2(
			406,
			_Utils_Tuple2('Incorporate', 'Introduce something into another thing already in existence; combine')),
			_Utils_Tuple2(
			407,
			_Utils_Tuple2('Incursion', 'Sudden invasion')),
			_Utils_Tuple2(
			408,
			_Utils_Tuple2('Indeterminate', 'Uncertain; indefinite')),
			_Utils_Tuple2(
			409,
			_Utils_Tuple2('Indigence', 'Poverty')),
			_Utils_Tuple2(
			410,
			_Utils_Tuple2('Indolant', 'Habitually lazy; idle')),
			_Utils_Tuple2(
			411,
			_Utils_Tuple2('Ineluctable', 'Not to be avoided or escaped; inevitable')),
			_Utils_Tuple2(
			412,
			_Utils_Tuple2('Inert', 'Unable to move; sluggish')),
			_Utils_Tuple2(
			413,
			_Utils_Tuple2('Ingenuous', 'Naive and trusting; lacking sophistication')),
			_Utils_Tuple2(
			414,
			_Utils_Tuple2('Inherent', 'Firmly established by nature or habit')),
			_Utils_Tuple2(
			415,
			_Utils_Tuple2('Innocuous', 'Harmless')),
			_Utils_Tuple2(
			416,
			_Utils_Tuple2('Insensible', 'Unconcious; unresponsive')),
			_Utils_Tuple2(
			417,
			_Utils_Tuple2('Insinuate', 'To suggest; say indirectly; imply')),
			_Utils_Tuple2(
			418,
			_Utils_Tuple2('Insipid', 'Lacking flavor; dull')),
			_Utils_Tuple2(
			419,
			_Utils_Tuple2('Insouciant', 'Indifferent; lacking concern or care')),
			_Utils_Tuple2(
			420,
			_Utils_Tuple2('Insularity', 'Narrow-mindedness; isolation')),
			_Utils_Tuple2(
			421,
			_Utils_Tuple2('Insuperable', 'Insurmountable; unconquerable')),
			_Utils_Tuple2(
			422,
			_Utils_Tuple2('Intangible', 'Not material')),
			_Utils_Tuple2(
			423,
			_Utils_Tuple2('Interdict', 'To forbid; prohibit; To confront and halt the activities, advance, or entry of')),
			_Utils_Tuple2(
			424,
			_Utils_Tuple2('Internecine', 'Deadly to both sides')),
			_Utils_Tuple2(
			425,
			_Utils_Tuple2('Interpolate', 'To insert; change by adding new words or material')),
			_Utils_Tuple2(
			426,
			_Utils_Tuple2('Interregnum', 'Interval between reigns; gap in continuity')),
			_Utils_Tuple2(
			427,
			_Utils_Tuple2('Intimate', 'Marked by close acquaintance')),
			_Utils_Tuple2(
			428,
			_Utils_Tuple2('Intractable', 'Not easily managed')),
			_Utils_Tuple2(
			429,
			_Utils_Tuple2('Intransigence', 'Stubbornness; refusal to compromise')),
			_Utils_Tuple2(
			430,
			_Utils_Tuple2('Introspective', 'Contemplating one\'s own thoughts and feelings')),
			_Utils_Tuple2(
			431,
			_Utils_Tuple2('Inundate', 'To cover with water; overwhelm')),
			_Utils_Tuple2(
			432,
			_Utils_Tuple2('Inured', 'Hardened; accustomed; used to')),
			_Utils_Tuple2(
			433,
			_Utils_Tuple2('Invective', 'Verbal abuse')),
			_Utils_Tuple2(
			434,
			_Utils_Tuple2('Inveigh', 'To disapprove; protest vehemently')),
			_Utils_Tuple2(
			435,
			_Utils_Tuple2('Inveigle', 'To win over by flattery or coaxing')),
			_Utils_Tuple2(
			436,
			_Utils_Tuple2('Inveterate', 'Confirmed; long-standing; deeply rooted')),
			_Utils_Tuple2(
			437,
			_Utils_Tuple2('Invidious', 'Likely to provike ill will; offensive')),
			_Utils_Tuple2(
			438,
			_Utils_Tuple2('Irascible', 'Easily angered')),
			_Utils_Tuple2(
			439,
			_Utils_Tuple2('Irresolute', 'Unsure of how to act; weak')),
			_Utils_Tuple2(
			440,
			_Utils_Tuple2('Itinerant', 'Wandering from place to place; unsettled')),
			_Utils_Tuple2(
			441,
			_Utils_Tuple2('Itinerary', 'Route of a traveler\'s journey')),
			_Utils_Tuple2(
			442,
			_Utils_Tuple2('Jaundiced', 'Having a yellowish discoloration of the skin; affected by envy, resentment, or hostility')),
			_Utils_Tuple2(
			443,
			_Utils_Tuple2('Jibe', 'To be in agreement')),
			_Utils_Tuple2(
			444,
			_Utils_Tuple2('Jocose', 'Fond of joking; jocular; playful')),
			_Utils_Tuple2(
			445,
			_Utils_Tuple2('Juggernaut', 'Huge force destorying everything in its path')),
			_Utils_Tuple2(
			446,
			_Utils_Tuple2('Junta', 'Group of people united in political intrigue')),
			_Utils_Tuple2(
			447,
			_Utils_Tuple2('Juxtapose ', 'Place side by side')),
			_Utils_Tuple2(
			448,
			_Utils_Tuple2('Kudos', 'Fame; glory; honor')),
			_Utils_Tuple2(
			449,
			_Utils_Tuple2('Labile', 'Likely to change')),
			_Utils_Tuple2(
			450,
			_Utils_Tuple2('Laconic', 'Using few words')),
			_Utils_Tuple2(
			451,
			_Utils_Tuple2('Lambaste', 'To thrash verbally or physically')),
			_Utils_Tuple2(
			452,
			_Utils_Tuple2('Lascivious', 'Lustful')),
			_Utils_Tuple2(
			453,
			_Utils_Tuple2('Lassitude', 'Lethargy; sluggishness')),
			_Utils_Tuple2(
			454,
			_Utils_Tuple2('Latent', 'Present but hidden; potential')),
			_Utils_Tuple2(
			455,
			_Utils_Tuple2('Laud', 'To praise')),
			_Utils_Tuple2(
			456,
			_Utils_Tuple2('Lethargic', 'Inactive')),
			_Utils_Tuple2(
			457,
			_Utils_Tuple2('Levee', 'An embankment that prevents a river from overflowing')),
			_Utils_Tuple2(
			458,
			_Utils_Tuple2('Levity', 'Light manner or attitude')),
			_Utils_Tuple2(
			459,
			_Utils_Tuple2('Liberal', 'Tolerant; broad-minded; generous; lavish')),
			_Utils_Tuple2(
			460,
			_Utils_Tuple2('Libertine', 'One without moral restraint')),
			_Utils_Tuple2(
			461,
			_Utils_Tuple2('Libido', 'Sexual desire')),
			_Utils_Tuple2(
			462,
			_Utils_Tuple2('Lilliputian', 'Extremely small')),
			_Utils_Tuple2(
			463,
			_Utils_Tuple2('Limn', 'To draw; describe')),
			_Utils_Tuple2(
			464,
			_Utils_Tuple2('Limpid', 'Clear; transparent')),
			_Utils_Tuple2(
			465,
			_Utils_Tuple2('Lingusitic', 'Pertaining to language')),
			_Utils_Tuple2(
			466,
			_Utils_Tuple2('Litany', 'Lengthy recitation; repetitive chant')),
			_Utils_Tuple2(
			467,
			_Utils_Tuple2('Literati', 'Scholarly or learned persons')),
			_Utils_Tuple2(
			468,
			_Utils_Tuple2('Litigation', 'Legal Proceedings')),
			_Utils_Tuple2(
			469,
			_Utils_Tuple2('Log', 'Record of a voyage; record of daily activities')),
			_Utils_Tuple2(
			470,
			_Utils_Tuple2('Loquacious', 'Talkative')),
			_Utils_Tuple2(
			471,
			_Utils_Tuple2('Lucid', 'Bright; clear; intelligible')),
			_Utils_Tuple2(
			472,
			_Utils_Tuple2('Lucre', 'Money or ptofits')),
			_Utils_Tuple2(
			473,
			_Utils_Tuple2('Luminous', 'Bright; brilliant; glowing')),
			_Utils_Tuple2(
			474,
			_Utils_Tuple2('Lustrous', 'Shining')),
			_Utils_Tuple2(
			475,
			_Utils_Tuple2('Machiavellian', 'Crafty; double-dealing')),
			_Utils_Tuple2(
			476,
			_Utils_Tuple2('Machinations', 'Plots or schemes')),
			_Utils_Tuple2(
			477,
			_Utils_Tuple2('Maelstrom', 'Whirlpool; turmoil')),
			_Utils_Tuple2(
			478,
			_Utils_Tuple2('Magnanimity', 'Generosity; nobility')),
			_Utils_Tuple2(
			479,
			_Utils_Tuple2('Malign', 'To speak evil of')),
			_Utils_Tuple2(
			480,
			_Utils_Tuple2('Malinger', 'To feign illness to escape duty')),
			_Utils_Tuple2(
			481,
			_Utils_Tuple2('Malleable', 'Capable of being shaped by pounding; impressionable')),
			_Utils_Tuple2(
			482,
			_Utils_Tuple2('Maverick', 'Dissenter')),
			_Utils_Tuple2(
			483,
			_Utils_Tuple2('Megalomania', 'Delusions of power or importance')),
			_Utils_Tuple2(
			484,
			_Utils_Tuple2('Menagerie', 'A variety of animals kept together')),
			_Utils_Tuple2(
			485,
			_Utils_Tuple2('Mendacious', 'Dishonest')),
			_Utils_Tuple2(
			486,
			_Utils_Tuple2('Mendicant', 'Beggar')),
			_Utils_Tuple2(
			487,
			_Utils_Tuple2('Meretricious', 'Gaudy; plausible but false; specious')),
			_Utils_Tuple2(
			488,
			_Utils_Tuple2('Mesmerize', 'To hypnotize')),
			_Utils_Tuple2(
			489,
			_Utils_Tuple2('Metamorphosis', 'Change; transform')),
			_Utils_Tuple2(
			490,
			_Utils_Tuple2('Metaphysics', 'Branch of philosophy that investigates the ultimate nature of reality')),
			_Utils_Tuple2(
			491,
			_Utils_Tuple2('Meteoroligical', 'Concerned with the weather')),
			_Utils_Tuple2(
			492,
			_Utils_Tuple2('Meticulous', 'Very careful; fastidious')),
			_Utils_Tuple2(
			493,
			_Utils_Tuple2('Mettle', 'Courage; endurance')),
			_Utils_Tuple2(
			494,
			_Utils_Tuple2('Mettlesome', 'Full of courage and fortitude; spirited')),
			_Utils_Tuple2(
			495,
			_Utils_Tuple2('Microcosm', 'A small system having analogies to a larger system; small world')),
			_Utils_Tuple2(
			496,
			_Utils_Tuple2('Militate', 'Work against')),
			_Utils_Tuple2(
			497,
			_Utils_Tuple2('Minatory', 'Threatening; menacing')),
			_Utils_Tuple2(
			498,
			_Utils_Tuple2('Minuscule', 'Very small')),
			_Utils_Tuple2(
			499,
			_Utils_Tuple2('Minutia', 'Petty details')),
			_Utils_Tuple2(
			500,
			_Utils_Tuple2('Misanthrope', 'One who hates humanity')),
			_Utils_Tuple2(
			501,
			_Utils_Tuple2('Miscellany', 'Mixture of writings on various subjects')),
			_Utils_Tuple2(
			502,
			_Utils_Tuple2('Miscreant', 'Villain; criminal')),
			_Utils_Tuple2(
			503,
			_Utils_Tuple2('Misogynist', 'One who hates women')),
			_Utils_Tuple2(
			504,
			_Utils_Tuple2('Mitigate', 'To cause to become less harsh, sever or painful; alleviate')),
			_Utils_Tuple2(
			505,
			_Utils_Tuple2('Mnemonic', 'Related to memory; assisting memory')),
			_Utils_Tuple2(
			506,
			_Utils_Tuple2('Modicum', 'Limited quantity')),
			_Utils_Tuple2(
			507,
			_Utils_Tuple2('Mollify', 'To smooth')),
			_Utils_Tuple2(
			508,
			_Utils_Tuple2('Monolithic', 'Solid and uniform; constituting a single, unified whole')),
			_Utils_Tuple2(
			509,
			_Utils_Tuple2('Morose', 'Ill-humored; sullen')),
			_Utils_Tuple2(
			510,
			_Utils_Tuple2('Motley', 'Many colored; made up of many parts')),
			_Utils_Tuple2(
			511,
			_Utils_Tuple2('Multifarious', 'Diverse')),
			_Utils_Tuple2(
			512,
			_Utils_Tuple2('Mundane', 'Worldly as opposed to spiritual; concerned with the ordinary')),
			_Utils_Tuple2(
			513,
			_Utils_Tuple2('Necromancy', 'Black magic')),
			_Utils_Tuple2(
			514,
			_Utils_Tuple2('Negate', 'To cancel out; nullify')),
			_Utils_Tuple2(
			515,
			_Utils_Tuple2('Neologism', 'New word or expression')),
			_Utils_Tuple2(
			516,
			_Utils_Tuple2('Neophyte', 'Novice; beginner')),
			_Utils_Tuple2(
			517,
			_Utils_Tuple2('Nexus', 'A means of connection; a connected group or series; a center')),
			_Utils_Tuple2(
			518,
			_Utils_Tuple2('Nonplussed', 'Bewildered')),
			_Utils_Tuple2(
			519,
			_Utils_Tuple2('Nostalgia', 'Sentimental longing for a past time')),
			_Utils_Tuple2(
			520,
			_Utils_Tuple2('Nostrum', 'Medicine or remedy of doubtful effectiveness; supposed cure')),
			_Utils_Tuple2(
			521,
			_Utils_Tuple2('Nugatory', 'Trifling; invalid')),
			_Utils_Tuple2(
			522,
			_Utils_Tuple2('Obdurate', 'Stubborn')),
			_Utils_Tuple2(
			523,
			_Utils_Tuple2('Obsequious', 'Overly submissive')),
			_Utils_Tuple2(
			524,
			_Utils_Tuple2('Obsequy', 'Funeral ceremony (often used in the plural, obsequies)')),
			_Utils_Tuple2(
			525,
			_Utils_Tuple2('Obviate', 'To make unnecessary; to anticipate and prevent')),
			_Utils_Tuple2(
			526,
			_Utils_Tuple2('Occlude', 'To shut; block')),
			_Utils_Tuple2(
			527,
			_Utils_Tuple2('Occult', 'Relating to practices connected with supernatural phenomena')),
			_Utils_Tuple2(
			528,
			_Utils_Tuple2('Odyssey', 'A long, adventrous voyage; a quest')),
			_Utils_Tuple2(
			529,
			_Utils_Tuple2('Officious', 'Too helpful; meddlesome')),
			_Utils_Tuple2(
			530,
			_Utils_Tuple2('Olfactory', 'Concerning the sense of smell')),
			_Utils_Tuple2(
			531,
			_Utils_Tuple2('Oligarchy', 'From of government in which power belongs to only a few leaders')),
			_Utils_Tuple2(
			532,
			_Utils_Tuple2('Onerous', 'Burdensome')),
			_Utils_Tuple2(
			533,
			_Utils_Tuple2('Onomatopoeia', 'Formation or use of words that imitate sounds of the actions they refer to')),
			_Utils_Tuple2(
			534,
			_Utils_Tuple2('Opprobrium', 'Disgrace; contempt')),
			_Utils_Tuple2(
			535,
			_Utils_Tuple2('Ornithologist', 'Scientist who studies birds')),
			_Utils_Tuple2(
			536,
			_Utils_Tuple2('Oscillate', 'To move back and forth')),
			_Utils_Tuple2(
			537,
			_Utils_Tuple2('Ostentatious', 'Showy; trying to attract attention; pretentious')),
			_Utils_Tuple2(
			538,
			_Utils_Tuple2('Overweening', 'Presumptuous; arrogant; overbearing')),
			_Utils_Tuple2(
			539,
			_Utils_Tuple2('Paean', 'Song of joy or triumph; a fervent expression of joy')),
			_Utils_Tuple2(
			540,
			_Utils_Tuple2('Paleontology', 'Study of past geological eras through fossil remains')),
			_Utils_Tuple2(
			541,
			_Utils_Tuple2('Pallid', 'Lacking color or liveliness')),
			_Utils_Tuple2(
			542,
			_Utils_Tuple2('Panegyric', 'Elaborate praise; formal hymn of praise')),
			_Utils_Tuple2(
			543,
			_Utils_Tuple2('Paragon', 'Model of excellence or perfection')),
			_Utils_Tuple2(
			544,
			_Utils_Tuple2('Partisan', 'One-sided; committed to a party, group, or cause; prejudiced')),
			_Utils_Tuple2(
			545,
			_Utils_Tuple2('Pathological', 'Departing from normal condition')),
			_Utils_Tuple2(
			546,
			_Utils_Tuple2('Patois', 'A regional dialect; nonstandard speech; jargon')),
			_Utils_Tuple2(
			547,
			_Utils_Tuple2('Paucity', 'Scarcity')),
			_Utils_Tuple2(
			548,
			_Utils_Tuple2('Pedantic', 'Showing off learning')),
			_Utils_Tuple2(
			549,
			_Utils_Tuple2('Pellucid', 'Transparent; translucent; easily understood')),
			_Utils_Tuple2(
			550,
			_Utils_Tuple2('Penchant', 'Inclination')),
			_Utils_Tuple2(
			551,
			_Utils_Tuple2('Penury', 'Extreme poverty')),
			_Utils_Tuple2(
			552,
			_Utils_Tuple2('Peregrination', 'A wandering from place to place')),
			_Utils_Tuple2(
			553,
			_Utils_Tuple2('Peremptory', 'Imperative; leaving no choice')),
			_Utils_Tuple2(
			554,
			_Utils_Tuple2('Perennial', 'Present throughout the years; persistent')),
			_Utils_Tuple2(
			555,
			_Utils_Tuple2('Perfidious', 'Faithless; disloyal; untrustworthy')),
			_Utils_Tuple2(
			556,
			_Utils_Tuple2('Perfunctory', 'Superficial; not thorough; performed really as a duty')),
			_Utils_Tuple2(
			557,
			_Utils_Tuple2('Perigee', 'Point in an orbit that is closest to the Earth')),
			_Utils_Tuple2(
			558,
			_Utils_Tuple2('Permeable', 'Penetrable')),
			_Utils_Tuple2(
			559,
			_Utils_Tuple2('Perturb', 'To disturb greatly; make uneasy or anxious; cause a body to deviate from its regular orbit')),
			_Utils_Tuple2(
			560,
			_Utils_Tuple2('Pervasive', 'Spread throughout every part')),
			_Utils_Tuple2(
			561,
			_Utils_Tuple2('Petulant', 'Rude; peevish')),
			_Utils_Tuple2(
			562,
			_Utils_Tuple2('Phlegmatic', 'Calm in temperment; sluggish')),
			_Utils_Tuple2(
			563,
			_Utils_Tuple2('Phoenix', 'Mythical, immortal bird that lives for 500 years, burns itself to death, and rises from its ashes; anything that is restored after suffering great destruction')),
			_Utils_Tuple2(
			564,
			_Utils_Tuple2('Physiognomy', 'Facial features')),
			_Utils_Tuple2(
			565,
			_Utils_Tuple2('Piety', 'Devoutness')),
			_Utils_Tuple2(
			566,
			_Utils_Tuple2('Piquant', 'Appealingly stimulating; pleasantly pungent; attractive')),
			_Utils_Tuple2(
			567,
			_Utils_Tuple2('Pique', 'Fleeting feeling of jurt pride')),
			_Utils_Tuple2(
			568,
			_Utils_Tuple2('Placate', 'To lessen another\'s anger; to pacify')),
			_Utils_Tuple2(
			569,
			_Utils_Tuple2('Placid', 'Calm')),
			_Utils_Tuple2(
			570,
			_Utils_Tuple2('Plaintive', 'Melancholy; mournful')),
			_Utils_Tuple2(
			571,
			_Utils_Tuple2('Plasticity', 'Condition of being able to be shaped or formed; pliability')),
			_Utils_Tuple2(
			572,
			_Utils_Tuple2('Platitude', 'Stal, overused expression')),
			_Utils_Tuple2(
			573,
			_Utils_Tuple2('Platonic', 'Spiritual; without sensual desire; theoretical')),
			_Utils_Tuple2(
			574,
			_Utils_Tuple2('Plethora', 'Excess; overabundance')),
			_Utils_Tuple2(
			575,
			_Utils_Tuple2('Plumb', 'To determine the depth; to examine deeply')),
			_Utils_Tuple2(
			576,
			_Utils_Tuple2('Plummet', 'To fall; plunge')),
			_Utils_Tuple2(
			577,
			_Utils_Tuple2('Plutocracy', 'Society ruled by the wealthy')),
			_Utils_Tuple2(
			578,
			_Utils_Tuple2('Porous', 'Full of holes; permeable to liquids')),
			_Utils_Tuple2(
			579,
			_Utils_Tuple2('Poseur', 'Person who affects an attitude or identity to impress others')),
			_Utils_Tuple2(
			580,
			_Utils_Tuple2('Pragmatic', 'Practical')),
			_Utils_Tuple2(
			581,
			_Utils_Tuple2('Prate', 'To talk idly; chatter')),
			_Utils_Tuple2(
			582,
			_Utils_Tuple2('Prattle', 'Meaningless, foolish talk')),
			_Utils_Tuple2(
			583,
			_Utils_Tuple2('Preamble', 'Preliminary statement')),
			_Utils_Tuple2(
			584,
			_Utils_Tuple2('Precarious', 'Uncertain')),
			_Utils_Tuple2(
			585,
			_Utils_Tuple2('Precept', 'Principle; law')),
			_Utils_Tuple2(
			586,
			_Utils_Tuple2('Precipitate', 'To cause to happen; throw down from a height OR rash; hasty; sudden')),
			_Utils_Tuple2(
			587,
			_Utils_Tuple2('Place', 'Holder')),
			_Utils_Tuple2(
			588,
			_Utils_Tuple2('Precursor', 'Forerunner; predecessor')),
			_Utils_Tuple2(
			589,
			_Utils_Tuple2('Preempt', 'To supersede; appropriate for oneself')),
			_Utils_Tuple2(
			590,
			_Utils_Tuple2('Prehensile', 'Capable of grasping')),
			_Utils_Tuple2(
			591,
			_Utils_Tuple2('Premonition', 'Forewarning; presentiment')),
			_Utils_Tuple2(
			592,
			_Utils_Tuple2('Presage', 'To foretell; indicate in advance')),
			_Utils_Tuple2(
			593,
			_Utils_Tuple2('Presumptuous', 'Rude; improperly bold; readiness to presume')),
			_Utils_Tuple2(
			594,
			_Utils_Tuple2('Preternatural', 'Beyond the normal course of nature; supernatural')),
			_Utils_Tuple2(
			595,
			_Utils_Tuple2('Prevaricate', 'To quibble; evade the truth')),
			_Utils_Tuple2(
			596,
			_Utils_Tuple2('Primoridal', 'Original; existing from the beginning')),
			_Utils_Tuple2(
			597,
			_Utils_Tuple2('Pristine', 'Untouched; uncorrupted')),
			_Utils_Tuple2(
			598,
			_Utils_Tuple2('Probity', 'Honesty; high-mindedness')),
			_Utils_Tuple2(
			599,
			_Utils_Tuple2('Problematic', 'Posing a problem; doubtful; unsettled')),
			_Utils_Tuple2(
			600,
			_Utils_Tuple2('Prodigal', 'Wasteful; extravagant; lavish')),
			_Utils_Tuple2(
			601,
			_Utils_Tuple2('Profound', 'Deep; not superficial')),
			_Utils_Tuple2(
			602,
			_Utils_Tuple2('Prohibitive', 'So high as to prevent the purchase or use of; preventing; forbidding')),
			_Utils_Tuple2(
			603,
			_Utils_Tuple2('Proliferate', 'To increase rapidly')),
			_Utils_Tuple2(
			604,
			_Utils_Tuple2('Propensity', 'Inclination; tendency')),
			_Utils_Tuple2(
			605,
			_Utils_Tuple2('Propitiate', 'To win over; appease')),
			_Utils_Tuple2(
			606,
			_Utils_Tuple2('Propriety', 'Correct conduct; fitness')),
			_Utils_Tuple2(
			607,
			_Utils_Tuple2('Proscribe', 'To condemn; forbid; outlaw')),
			_Utils_Tuple2(
			608,
			_Utils_Tuple2('Provident', 'Providing for future needs; frugal')),
			_Utils_Tuple2(
			609,
			_Utils_Tuple2('Puissant', 'Powerful')),
			_Utils_Tuple2(
			610,
			_Utils_Tuple2('Punctilious', 'Careful in observing rules of behavior or ceremony')),
			_Utils_Tuple2(
			611,
			_Utils_Tuple2('Pungent', 'Strong or sharp in smell or taste; penetrating; caustic; to the point')),
			_Utils_Tuple2(
			612,
			_Utils_Tuple2('Purport', 'To profess; suppose; claim')),
			_Utils_Tuple2(
			613,
			_Utils_Tuple2('Pusillanimous', 'Cowardly')),
			_Utils_Tuple2(
			614,
			_Utils_Tuple2('Quagmire', 'Marsh; difficult situation')),
			_Utils_Tuple2(
			615,
			_Utils_Tuple2('Quail', 'To cower; lose heart')),
			_Utils_Tuple2(
			616,
			_Utils_Tuple2('Qualified', 'Limited; restricted')),
			_Utils_Tuple2(
			617,
			_Utils_Tuple2('Qualm', 'Sudden feeling of faintness or nausea; uneasy feeling about the rightness of actions')),
			_Utils_Tuple2(
			618,
			_Utils_Tuple2('Query', 'To question')),
			_Utils_Tuple2(
			619,
			_Utils_Tuple2('Quibble', 'To argue over insignificant and irrelevant details')),
			_Utils_Tuple2(
			620,
			_Utils_Tuple2('Quiescent', 'Inactive; still')),
			_Utils_Tuple2(
			621,
			_Utils_Tuple2('Quorum', 'Number of members necessary to conduct a meeting')),
			_Utils_Tuple2(
			622,
			_Utils_Tuple2('Raconteur', 'Witty, skillful storyteller')),
			_Utils_Tuple2(
			623,
			_Utils_Tuple2('Rail', 'To scold with bitter or abusive language')),
			_Utils_Tuple2(
			624,
			_Utils_Tuple2('Raiment', 'Clothing')),
			_Utils_Tuple2(
			625,
			_Utils_Tuple2('Ramification', 'Implication; outgrowth; consequence')),
			_Utils_Tuple2(
			626,
			_Utils_Tuple2('Rarefied', 'Refined')),
			_Utils_Tuple2(
			627,
			_Utils_Tuple2('Rationale', 'Fundamental reason')),
			_Utils_Tuple2(
			628,
			_Utils_Tuple2('Rebus', 'Puzzle in which pictures or symbols represent words')),
			_Utils_Tuple2(
			629,
			_Utils_Tuple2('Recalcitrant', 'Resisting authority or control')),
			_Utils_Tuple2(
			630,
			_Utils_Tuple2('Recant', 'To retract a statement or opinion')),
			_Utils_Tuple2(
			631,
			_Utils_Tuple2('Recluse', 'A person who lives in seclusion and often in solitude')),
			_Utils_Tuple2(
			632,
			_Utils_Tuple2('Recondite', 'Abstruse; profound')),
			_Utils_Tuple2(
			633,
			_Utils_Tuple2('Redoubtable', 'Formidable; arousing fear; worthy of respect')),
			_Utils_Tuple2(
			634,
			_Utils_Tuple2('Refractory', 'Stubborn; unmanageable; resisting ordinary methods of treatment')),
			_Utils_Tuple2(
			635,
			_Utils_Tuple2('Refulgent', 'Brightly shining; resplendent')),
			_Utils_Tuple2(
			636,
			_Utils_Tuple2('Refute', 'To contradict; disprove')),
			_Utils_Tuple2(
			637,
			_Utils_Tuple2('Regale', 'To entertain')),
			_Utils_Tuple2(
			638,
			_Utils_Tuple2('Relegate', 'To consign to an inferior position')),
			_Utils_Tuple2(
			639,
			_Utils_Tuple2('Remonstrate', 'To object or protest')),
			_Utils_Tuple2(
			640,
			_Utils_Tuple2('Renege', 'To go back on one\'s word')),
			_Utils_Tuple2(
			641,
			_Utils_Tuple2('Reparation', 'Amends; compensation')),
			_Utils_Tuple2(
			642,
			_Utils_Tuple2('Repine', 'Fret; complain')),
			_Utils_Tuple2(
			643,
			_Utils_Tuple2('Reprise', 'Repetition, especially of a piece of music')),
			_Utils_Tuple2(
			644,
			_Utils_Tuple2('Reproach', 'To find fault with; blame')),
			_Utils_Tuple2(
			645,
			_Utils_Tuple2('Reprobate', 'Morally unprincipled person')),
			_Utils_Tuple2(
			646,
			_Utils_Tuple2('Repudiate', 'To reject as having no authority')),
			_Utils_Tuple2(
			647,
			_Utils_Tuple2('Rescind', 'To cancel')),
			_Utils_Tuple2(
			648,
			_Utils_Tuple2('Resolution', 'Determination; resolve')),
			_Utils_Tuple2(
			649,
			_Utils_Tuple2('Resolve', 'Determination; firmness of purpse')),
			_Utils_Tuple2(
			650,
			_Utils_Tuple2('Reticent', 'Not speaking freely; reserved; reluctant')),
			_Utils_Tuple2(
			651,
			_Utils_Tuple2('Reverent', 'Expressing deep respect; worshipful')),
			_Utils_Tuple2(
			652,
			_Utils_Tuple2('Riposte', 'A retaliatory action or retort')),
			_Utils_Tuple2(
			653,
			_Utils_Tuple2('Rococo', 'Excessively ornate; highly decorated; style of architecture in 18th-century Europe')),
			_Utils_Tuple2(
			654,
			_Utils_Tuple2('Rubric', 'Tile or heading; category; established mode of procedure or conduct; protocol')),
			_Utils_Tuple2(
			655,
			_Utils_Tuple2('Rue', 'To regret')),
			_Utils_Tuple2(
			656,
			_Utils_Tuple2('Ruse', 'Trick; crafty stratagem; subterfuge')),
			_Utils_Tuple2(
			657,
			_Utils_Tuple2('Sage', 'Wise')),
			_Utils_Tuple2(
			658,
			_Utils_Tuple2('Salacious', 'Lascivious; lustful')),
			_Utils_Tuple2(
			659,
			_Utils_Tuple2('Salubrious', 'Healthful')),
			_Utils_Tuple2(
			660,
			_Utils_Tuple2('Salutary', 'Expecting improvement; favorable to health')),
			_Utils_Tuple2(
			661,
			_Utils_Tuple2('Sanction', 'To approve; ratify; permit')),
			_Utils_Tuple2(
			662,
			_Utils_Tuple2('Sardonic', 'Cynical; scornfully mocking')),
			_Utils_Tuple2(
			663,
			_Utils_Tuple2('Sartorial', 'Pertaining to tailors')),
			_Utils_Tuple2(
			664,
			_Utils_Tuple2('Satiate', 'To satisfy')),
			_Utils_Tuple2(
			665,
			_Utils_Tuple2('Saturate', 'To soak throughly; imbue throughout')),
			_Utils_Tuple2(
			666,
			_Utils_Tuple2('Saturnine', 'Gloomy')),
			_Utils_Tuple2(
			667,
			_Utils_Tuple2('Satyr', 'A creature that is half-man, half-beast with the horns and legs of a goat; it is a follower of Dionysos; a lecher')),
			_Utils_Tuple2(
			668,
			_Utils_Tuple2('Savor', 'To enjoy; have a distinctive flavor or smell')),
			_Utils_Tuple2(
			669,
			_Utils_Tuple2('Schematic', 'Relating to or in the form of an outline or diagram')),
			_Utils_Tuple2(
			670,
			_Utils_Tuple2('Secrete', 'Produce and release substance into organism')),
			_Utils_Tuple2(
			671,
			_Utils_Tuple2('Sedition', 'Behavior prompting rebellion')),
			_Utils_Tuple2(
			672,
			_Utils_Tuple2('Sedulous', 'Diligent')),
			_Utils_Tuple2(
			673,
			_Utils_Tuple2('Seismic', 'Relating to earthquakes; earthshaking')),
			_Utils_Tuple2(
			674,
			_Utils_Tuple2('Sensual', 'Relating to the senses; gratifying the physical senses, especially sexual appetites')),
			_Utils_Tuple2(
			675,
			_Utils_Tuple2('Sensuous', 'Relating to the senses; operating through the senses')),
			_Utils_Tuple2(
			676,
			_Utils_Tuple2('Sentient', 'Aware; concious; able to perceive')),
			_Utils_Tuple2(
			677,
			_Utils_Tuple2('Servile', 'Submissive; obedient')),
			_Utils_Tuple2(
			678,
			_Utils_Tuple2('Sextant', 'Navigation tool that determines latitude and longitude')),
			_Utils_Tuple2(
			679,
			_Utils_Tuple2('Shard', 'A piece of broken glass or pottery')),
			_Utils_Tuple2(
			680,
			_Utils_Tuple2('Sidereal', 'Relating to the stars')),
			_Utils_Tuple2(
			681,
			_Utils_Tuple2('Simian', 'Apelike; relating to apes')),
			_Utils_Tuple2(
			682,
			_Utils_Tuple2('Simile', 'Comparison of one thing with abother using \"like\" or \"as\"')),
			_Utils_Tuple2(
			683,
			_Utils_Tuple2('Sinecure', 'Well-paying job or office that requires little or no work')),
			_Utils_Tuple2(
			684,
			_Utils_Tuple2('Singular', 'Unique; extraordinary; odd')),
			_Utils_Tuple2(
			685,
			_Utils_Tuple2('Sinuous', 'Winding; intricate; complex')),
			_Utils_Tuple2(
			686,
			_Utils_Tuple2('Skeptic', 'One who doubts')),
			_Utils_Tuple2(
			687,
			_Utils_Tuple2('Sobriety', 'Seriousness')),
			_Utils_Tuple2(
			688,
			_Utils_Tuple2('Sodden', 'Thoroughly soaked; saturated')),
			_Utils_Tuple2(
			689,
			_Utils_Tuple2('Solicitous', 'Concerned; attentive; eager')),
			_Utils_Tuple2(
			690,
			_Utils_Tuple2('Soliloquy', 'Long speech given to oneself')),
			_Utils_Tuple2(
			691,
			_Utils_Tuple2('Solvent', 'Able to meet financial obligations')),
			_Utils_Tuple2(
			692,
			_Utils_Tuple2('Somatic', 'Relating to or affecting the body; corporeal')),
			_Utils_Tuple2(
			693,
			_Utils_Tuple2('Soporific', 'Sleeo producing')),
			_Utils_Tuple2(
			694,
			_Utils_Tuple2('Sordid', 'Filthy; contemptible and corrupt')),
			_Utils_Tuple2(
			695,
			_Utils_Tuple2('Specious', 'Seeming to be logical and sound, but not really so')),
			_Utils_Tuple2(
			696,
			_Utils_Tuple2('Spectrum', 'Band of colors produced when sunlight passes through a prism; a broad range of related ideas or objects')),
			_Utils_Tuple2(
			697,
			_Utils_Tuple2('Spendthrift', 'Person who spends money recklessly')),
			_Utils_Tuple2(
			698,
			_Utils_Tuple2('Sporadic', 'Irregular')),
			_Utils_Tuple2(
			699,
			_Utils_Tuple2('Squalor', 'Filthy, wretched condition')),
			_Utils_Tuple2(
			700,
			_Utils_Tuple2('Staccato', 'Marked by abrupt, clear-cut sounds')),
			_Utils_Tuple2(
			701,
			_Utils_Tuple2('Stanch', 'To stop or check the flow of')),
			_Utils_Tuple2(
			702,
			_Utils_Tuple2('Stentorian', 'Extremely loud')),
			_Utils_Tuple2(
			703,
			_Utils_Tuple2('Stigma', 'Mark of disgrace or inferiority')),
			_Utils_Tuple2(
			704,
			_Utils_Tuple2('Stint', 'To be sparing')),
			_Utils_Tuple2(
			705,
			_Utils_Tuple2('Stipulate', 'To specify an essential condition')),
			_Utils_Tuple2(
			706,
			_Utils_Tuple2('Stolid', 'Having or showing little emotion')),
			_Utils_Tuple2(
			707,
			_Utils_Tuple2('Stratified', 'Arranged in layers')),
			_Utils_Tuple2(
			708,
			_Utils_Tuple2('Striated', 'Marked with thin, narrow grooves or channes')),
			_Utils_Tuple2(
			709,
			_Utils_Tuple2('Stricture', 'Something that restrains; negative criticism')),
			_Utils_Tuple2(
			710,
			_Utils_Tuple2('Strident', 'Loud; harsh; unpleasantly noisy')),
			_Utils_Tuple2(
			711,
			_Utils_Tuple2('Strut', 'To swagger; display to impress others')),
			_Utils_Tuple2(
			712,
			_Utils_Tuple2('Stultify', 'To impair or reduce to uselessness')),
			_Utils_Tuple2(
			713,
			_Utils_Tuple2('Stupefy', 'To dull the senses of; stun; astonish')),
			_Utils_Tuple2(
			714,
			_Utils_Tuple2('Stygian', 'Dark and gloomy; hellish')),
			_Utils_Tuple2(
			715,
			_Utils_Tuple2('Subpoena', 'Notice ordering someone to appear in court')),
			_Utils_Tuple2(
			716,
			_Utils_Tuple2('Subside', 'To settle down; grow quiet')),
			_Utils_Tuple2(
			717,
			_Utils_Tuple2('Substantiate', 'To support with proof or evidence')),
			_Utils_Tuple2(
			718,
			_Utils_Tuple2('Substantive', 'Essential; pertaining to the substance')),
			_Utils_Tuple2(
			719,
			_Utils_Tuple2('Subsume', 'To include; incorporate')),
			_Utils_Tuple2(
			720,
			_Utils_Tuple2('Subversive', 'Intended to undermine or overthrow, especially an established government')),
			_Utils_Tuple2(
			721,
			_Utils_Tuple2('Succor', 'Relief; help in time of distress or want')),
			_Utils_Tuple2(
			722,
			_Utils_Tuple2('Suffrage', 'The right to vote')),
			_Utils_Tuple2(
			723,
			_Utils_Tuple2('Sundry', 'Various')),
			_Utils_Tuple2(
			724,
			_Utils_Tuple2('Supersede', 'To replace, especially to displace as inferior or antiquated')),
			_Utils_Tuple2(
			725,
			_Utils_Tuple2('Supine', 'Lying on the back; marked by lethargy')),
			_Utils_Tuple2(
			726,
			_Utils_Tuple2('Supplant', 'To replace; substitute')),
			_Utils_Tuple2(
			727,
			_Utils_Tuple2('Suppliant', 'Beseeching')),
			_Utils_Tuple2(
			728,
			_Utils_Tuple2('Supplicant', 'One who asks humbly and earnestly')),
			_Utils_Tuple2(
			729,
			_Utils_Tuple2('Supposition', 'The act of assuming to be true or real')),
			_Utils_Tuple2(
			730,
			_Utils_Tuple2('Syllogism', 'A form of deductive reasoning that has a major premise, a minor premise, and a conclusion')),
			_Utils_Tuple2(
			731,
			_Utils_Tuple2('Sylvan', 'Related to the woods or forest')),
			_Utils_Tuple2(
			732,
			_Utils_Tuple2('Tacit', 'Silently understood; implied')),
			_Utils_Tuple2(
			733,
			_Utils_Tuple2('Taciturn', 'Habitually untalkative')),
			_Utils_Tuple2(
			734,
			_Utils_Tuple2('Talisman', 'Charm to bring good luck and avert misfortune')),
			_Utils_Tuple2(
			735,
			_Utils_Tuple2('Tangential', 'Peripheral; digressing')),
			_Utils_Tuple2(
			736,
			_Utils_Tuple2('Tautology', 'Unnecessary repetition')),
			_Utils_Tuple2(
			737,
			_Utils_Tuple2('Taxonomy', 'Science of classification; in biology, the process of classifying organisms in categories')),
			_Utils_Tuple2(
			738,
			_Utils_Tuple2('Tenet', 'Belief; doctrine')),
			_Utils_Tuple2(
			739,
			_Utils_Tuple2('Tenuous', 'Weak; insubstantial')),
			_Utils_Tuple2(
			740,
			_Utils_Tuple2('Theocracy', 'Government by priests representing a god')),
			_Utils_Tuple2(
			741,
			_Utils_Tuple2('Thespian', 'An actor or actress')),
			_Utils_Tuple2(
			742,
			_Utils_Tuple2('Timbre', 'The characteristic quality of sound produced by a particular instrument or voice; tone color')),
			_Utils_Tuple2(
			743,
			_Utils_Tuple2('Tirade', 'Long, violent speech; verbal assault')),
			_Utils_Tuple2(
			744,
			_Utils_Tuple2('Toady', 'Flatterer; hanger-on; yes-man')),
			_Utils_Tuple2(
			745,
			_Utils_Tuple2('Tome', 'Book, usually large and academic')),
			_Utils_Tuple2(
			746,
			_Utils_Tuple2('Torpor', 'Lethargy; dormancy; sluggishness')),
			_Utils_Tuple2(
			747,
			_Utils_Tuple2('Torque', 'A turning or twisting force; the moment of a force')),
			_Utils_Tuple2(
			748,
			_Utils_Tuple2('Tortuous', 'Having many twists and turns; highly complex')),
			_Utils_Tuple2(
			749,
			_Utils_Tuple2('Tout', 'To promote or praise energetically')),
			_Utils_Tuple2(
			750,
			_Utils_Tuple2('Tractable', 'Obedient; yielding')),
			_Utils_Tuple2(
			751,
			_Utils_Tuple2('Transgression', 'Act of trespassing or violating a law or rule')),
			_Utils_Tuple2(
			752,
			_Utils_Tuple2('Transient', 'Temporary; short-lived; fleeting')),
			_Utils_Tuple2(
			753,
			_Utils_Tuple2('Translucent', 'Partially transparent')),
			_Utils_Tuple2(
			754,
			_Utils_Tuple2('Travail', 'Work, especially arduous work; tribulation; anguish')),
			_Utils_Tuple2(
			755,
			_Utils_Tuple2('Travesty', 'Parody; exaggerated imitation; caricature')),
			_Utils_Tuple2(
			756,
			_Utils_Tuple2('Treatise', 'Article treating a subject systematically and thoroughly')),
			_Utils_Tuple2(
			757,
			_Utils_Tuple2('Tremulous', 'Trembling; quivering; frugal; timid')),
			_Utils_Tuple2(
			758,
			_Utils_Tuple2('Trepidation', 'Fear and anxiety')),
			_Utils_Tuple2(
			759,
			_Utils_Tuple2('Truculence', 'Aggressiveness; ferocity')),
			_Utils_Tuple2(
			760,
			_Utils_Tuple2('Tryst', 'Agreement between lovers to meet; rendezvous')),
			_Utils_Tuple2(
			761,
			_Utils_Tuple2('Tumid', 'Swollen; distended')),
			_Utils_Tuple2(
			762,
			_Utils_Tuple2('Turbid', 'Muddy; opaque; in a state of great confusion')),
			_Utils_Tuple2(
			763,
			_Utils_Tuple2('Turgid', 'Swollen; bloated; pompous')),
			_Utils_Tuple2(
			764,
			_Utils_Tuple2('Tutelary', 'Serving as a guardian or protector')),
			_Utils_Tuple2(
			765,
			_Utils_Tuple2('Uncanny', 'Mysterious; strange')),
			_Utils_Tuple2(
			766,
			_Utils_Tuple2('Undulating', 'Moving in waves')),
			_Utils_Tuple2(
			767,
			_Utils_Tuple2('Unfeigned', 'Not false; not made up; genuine')),
			_Utils_Tuple2(
			768,
			_Utils_Tuple2('Untenable', 'Indefensible')),
			_Utils_Tuple2(
			769,
			_Utils_Tuple2('Untoward', 'Not favorable; troublesome; adverse; unruly')),
			_Utils_Tuple2(
			770,
			_Utils_Tuple2('Usury', 'Practice of lending money at exorbitant rates')),
			_Utils_Tuple2(
			771,
			_Utils_Tuple2('Vacillate', 'To waver; oscillate')),
			_Utils_Tuple2(
			772,
			_Utils_Tuple2('Vacuous', 'Empty; void; lacking intelligence; purposeless')),
			_Utils_Tuple2(
			773,
			_Utils_Tuple2('Valedictory', 'Pertaining to a farewell')),
			_Utils_Tuple2(
			774,
			_Utils_Tuple2('Vapid', 'Tasteless; dull')),
			_Utils_Tuple2(
			775,
			_Utils_Tuple2('Variegated', 'Varied; marked with different colors')),
			_Utils_Tuple2(
			776,
			_Utils_Tuple2('Vaunt', 'To boast; brag')),
			_Utils_Tuple2(
			777,
			_Utils_Tuple2('Venal', 'Bribable; mercenary; corruptible')),
			_Utils_Tuple2(
			778,
			_Utils_Tuple2('Vendetta', 'Prolonged feud marked by bitter hostility')),
			_Utils_Tuple2(
			779,
			_Utils_Tuple2('Venerate', 'To adore; honor; respect')),
			_Utils_Tuple2(
			780,
			_Utils_Tuple2('Veracious', 'Truthful; accurate')),
			_Utils_Tuple2(
			781,
			_Utils_Tuple2('Verbose', 'Wordy')),
			_Utils_Tuple2(
			782,
			_Utils_Tuple2('Vertigo', 'Dizziness')),
			_Utils_Tuple2(
			783,
			_Utils_Tuple2('Vexation', 'Irritation; annoyance; confusion; puzzlement')),
			_Utils_Tuple2(
			784,
			_Utils_Tuple2('Viable', 'Practicable; capable of developing')),
			_Utils_Tuple2(
			785,
			_Utils_Tuple2('Vindictive', 'Spiteful; vengeful; unforgibing')),
			_Utils_Tuple2(
			786,
			_Utils_Tuple2('Virtuoso', 'Someone with masterly skills; expert musician')),
			_Utils_Tuple2(
			787,
			_Utils_Tuple2('Visage', 'Countenance; appearance; aspect')),
			_Utils_Tuple2(
			788,
			_Utils_Tuple2('Viscous', 'Thick; syrupy and sticky')),
			_Utils_Tuple2(
			789,
			_Utils_Tuple2('Vititate', 'To impair the quality of; corrupt morally; make inoperative')),
			_Utils_Tuple2(
			790,
			_Utils_Tuple2('Vituperative', 'Using or containing harsh, abusive censure')),
			_Utils_Tuple2(
			791,
			_Utils_Tuple2('Vivisection', 'dissection, surgery, or painful experiments performed on a living animal for the purpose of scientific research')),
			_Utils_Tuple2(
			792,
			_Utils_Tuple2('Vogue', 'Prevailing fashion or practice')),
			_Utils_Tuple2(
			793,
			_Utils_Tuple2('Volatile', 'Tending to vary frequently; fickle')),
			_Utils_Tuple2(
			794,
			_Utils_Tuple2('Vortex', 'Whirlpool; whirlwind; center of turbulence')),
			_Utils_Tuple2(
			795,
			_Utils_Tuple2('Warranted', 'Justified')),
			_Utils_Tuple2(
			796,
			_Utils_Tuple2('Wary', 'Careful; cautious')),
			_Utils_Tuple2(
			797,
			_Utils_Tuple2('Welter', 'To wallow or roll; toss about; be in turmoil')),
			_Utils_Tuple2(
			798,
			_Utils_Tuple2('Whimsical', 'Fanciful; unpredictable')),
			_Utils_Tuple2(
			799,
			_Utils_Tuple2('Wistful', 'Vaguely longing; sadly thoughtful')),
			_Utils_Tuple2(
			800,
			_Utils_Tuple2('Zealot', 'One who is fanatically devoted to a cause'))
		]));
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		A6(
			$author$project$Main$Model,
			$author$project$Data$data,
			$author$project$Main$WordsList(
				_Utils_Tuple2(1, 10)),
			_Utils_Tuple2(1, 10),
			_Utils_Tuple2(1, 800),
			$elm$core$Dict$empty,
			$elm$core$Dict$empty),
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Main$Quiz = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$StartQuiz = function (a) {
	return {$: 0, a: a};
};
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$random$Random$maxInt = 2147483647;
var $elm$random$Random$minInt = -2147483648;
var $elm_community$random_extra$Random$List$anyInt = A2($elm$random$Random$int, $elm$random$Random$minInt, $elm$random$Random$maxInt);
var $elm$random$Random$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var genA = _v0;
		var genB = _v1;
		var genC = _v2;
		return function (seed0) {
			var _v3 = genA(seed0);
			var a = _v3.a;
			var seed1 = _v3.b;
			var _v4 = genB(seed1);
			var b = _v4.a;
			var seed2 = _v4.b;
			var _v5 = genC(seed2);
			var c = _v5.a;
			var seed3 = _v5.b;
			return _Utils_Tuple2(
				A3(func, a, b, c),
				seed3);
		};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$random$Random$independentSeed = function (seed0) {
	var makeIndependentSeed = F3(
		function (state, b, c) {
			return $elm$random$Random$next(
				A2($elm$random$Random$Seed, state, (1 | (b ^ c)) >>> 0));
		});
	var gen = A2($elm$random$Random$int, 0, 4294967295);
	return A2(
		$elm$random$Random$step,
		A4($elm$random$Random$map3, makeIndependentSeed, gen, gen, gen),
		seed0);
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	return A2(
		$elm$random$Random$map,
		function (independentSeed) {
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A3(
						$elm$core$List$foldl,
						F2(
							function (item, _v0) {
								var acc = _v0.a;
								var seed = _v0.b;
								var _v1 = A2($elm$random$Random$step, $elm_community$random_extra$Random$List$anyInt, seed);
								var tag = _v1.a;
								var nextSeed = _v1.b;
								return _Utils_Tuple2(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(item, tag),
										acc),
									nextSeed);
							}),
						_Utils_Tuple2(_List_Nil, independentSeed),
						list).a));
		},
		$elm$random$Random$independentSeed);
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 6:
				var _v1 = model.m;
				var start = _v1.a;
				var end = _v1.b;
				var quantity = (end - start) + 1;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$random$Random$generate,
						$author$project$Main$StartQuiz,
						A2(
							$elm$random$Random$map,
							function (list) {
								return $elm$core$Dict$fromList(
									A2(
										$elm$core$List$indexedMap,
										F2(
											function (index, item) {
												return _Utils_Tuple2(index, item);
											}),
										list));
							},
							A2(
								$elm$random$Random$list,
								quantity,
								A2(
									$elm$random$Random$map,
									$elm$core$List$take(4),
									$elm_community$random_extra$Random$List$shuffle(
										A2($elm$core$List$range, 0, 799)))))));
			case 0:
				var options = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							C: $elm$core$Dict$empty,
							H: $author$project$Main$Quiz(model.m),
							M: options
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							H: $author$project$Main$WordsList(model.s)
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var start = msg.a;
				var _v2 = model.m;
				var end = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: _Utils_Tuple2(
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$elm$core$String$toInt(start)),
								end)
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var end = msg.a;
				var _v3 = model.m;
				var start = _v3.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: _Utils_Tuple2(
								start,
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$elm$core$String$toInt(end)))
						}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var start = msg.a;
				var _v4 = model.s;
				var end = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							s: _Utils_Tuple2(
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$elm$core$String$toInt(start)),
								end)
						}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var end = msg.a;
				var _v5 = model.s;
				var start = _v5.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							s: _Utils_Tuple2(
								start,
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$elm$core$String$toInt(end)))
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var wordIndex = msg.a;
				var optionIndex = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							C: A3($elm$core$Dict$insert, wordIndex, optionIndex, model.C)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$Correct = 0;
var $author$project$Main$CreateWordsList = {$: 1};
var $author$project$Main$Incorrect = 1;
var $author$project$Main$MarkOption = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Main$RandomizeNewQuiz = {$: 6};
var $author$project$Main$UpdateQuizRangeEnd = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$UpdateQuizRangeStart = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$UpdateWordsListRangeEnd = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$UpdateWordsListRangeStart = function (a) {
	return {$: 4, a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$not = _Basics_not;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm_community$html_extra$Html$Events$Extra$onClickPreventDefault = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, true)));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$scope = $elm$html$Html$Attributes$stringProperty('scope');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col-4')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-3')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('New Quiz')
									])),
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Range')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('input-group mb-3')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$class('form-control'),
												$elm$html$Html$Attributes$placeholder('Start'),
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(model.m.a)),
												$elm$html$Html$Events$onInput($author$project$Main$UpdateQuizRangeStart)
											]),
										_List_Nil),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$class('form-control'),
												$elm$html$Html$Attributes$placeholder('End'),
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(model.m.b)),
												$elm$html$Html$Events$onInput($author$project$Main$UpdateQuizRangeEnd)
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline-success'),
										$elm$html$Html$Events$onClick($author$project$Main$RandomizeNewQuiz)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Start')
									])),
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-3')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('New Words List')
									])),
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Range')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('input-group mb-3')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$class('form-control'),
												$elm$html$Html$Attributes$placeholder('Start'),
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(model.s.a)),
												$elm$html$Html$Events$onInput($author$project$Main$UpdateWordsListRangeStart)
											]),
										_List_Nil),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$class('form-control'),
												$elm$html$Html$Attributes$placeholder('End'),
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(model.s.b)),
												$elm$html$Html$Events$onInput($author$project$Main$UpdateWordsListRangeEnd)
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline-success'),
										$elm$html$Html$Events$onClick($author$project$Main$CreateWordsList)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Create')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col-8')
					]),
				function () {
					var _v0 = model.H;
					if (!_v0.$) {
						var range = _v0.a;
						var start = $elm$core$String$fromInt(range.a);
						var end = $elm$core$String$fromInt(range.b);
						return A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$h1,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Quiz (' + (start + (' to ' + (end + ')'))))
									])),
							A2(
								$elm$core$List$map,
								function (index) {
									var optionIndices = A2(
										$elm$core$Maybe$withDefault,
										_List_fromArray(
											[0, 1, 2, 3]),
										A2($elm$core$Dict$get, index - 1, model.M));
									var minOptionIndex = A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$List$minimum(optionIndices));
									var correctOptionInIndices = A2(
										$elm$core$List$any,
										function (index_) {
											return _Utils_eq(index_, index);
										},
										optionIndices);
									var options = A2(
										$elm$core$List$map,
										function (index_) {
											var _v4 = ((!correctOptionInIndices) && _Utils_eq(minOptionIndex, index_)) ? _Utils_Tuple2(0, index) : _Utils_Tuple2(1, index_);
											var result = _v4.a;
											var finalIndex = _v4.b;
											return function (wordMeaning) {
												return _Utils_Tuple2(result, wordMeaning.b);
											}(
												A2(
													$elm$core$Maybe$withDefault,
													_Utils_Tuple2('', 'Not found'),
													A2($elm$core$Dict$get, finalIndex, model.I)));
										},
										optionIndices);
									var _v1 = A2(
										$elm$core$Maybe$withDefault,
										_Utils_Tuple2('Not found', ''),
										A2($elm$core$Dict$get, index, model.I));
									var word = _v1.a;
									return A2(
										$elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h3,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('my-3')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														$elm$core$String$fromInt(index) + ('. ' + word))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('list-group list-group-numbered mb-3')
													]),
												A2(
													$elm$core$List$indexedMap,
													F2(
														function (optionIndex, _v2) {
															var result = _v2.a;
															var meaning = _v2.b;
															var contextualClass = function () {
																var _v3 = A2($elm$core$Dict$get, index, model.C);
																if (!_v3.$) {
																	var optionIndex_ = _v3.a;
																	return _Utils_eq(optionIndex_, optionIndex) ? ((!result) ? ' list-group-item-success' : ((result === 1) ? ' list-group-item-danger' : '')) : '';
																} else {
																	return '';
																}
															}();
															return A2(
																$elm$html$Html$a,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$href('#'),
																		$elm$html$Html$Attributes$class('list-group-item list-group-item-action' + contextualClass),
																		$elm_community$html_extra$Html$Events$Extra$onClickPreventDefault(
																		A2($author$project$Main$MarkOption, index, optionIndex))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text(meaning)
																	]));
														}),
													options))
											]));
								},
								A2($elm$core$List$range, range.a, range.b)));
					} else {
						var range = _v0.a;
						var start = $elm$core$String$fromInt(range.a);
						var end = $elm$core$String$fromInt(range.b);
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$h1,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Words List (' + (start + (' to ' + (end + ')'))))
									])),
								A2(
								$elm$html$Html$table,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('table')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$thead,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$tr,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$scope('col')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('#')
															])),
														A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$scope('col')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Word')
															])),
														A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$scope('col')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Meaning')
															]))
													]))
											])),
										A2(
										$elm$html$Html$tbody,
										_List_Nil,
										A2(
											$elm$core$List$map,
											function (index) {
												var item = A2(
													$elm$core$Maybe$withDefault,
													_Utils_Tuple2('Not found', 'Not found'),
													A2($elm$core$Dict$get, index, model.I));
												return A2(
													$elm$html$Html$tr,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$th,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$scope('row')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	$elm$core$String$fromInt(index))
																])),
															A2(
															$elm$html$Html$td,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text(item.a)
																])),
															A2(
															$elm$html$Html$td,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text(item.b)
																]))
														]));
											},
											A2($elm$core$List$range, range.a, range.b)))
									]))
							]);
					}
				}())
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{az: $author$project$Main$init, aF: $author$project$Main$subscriptions, aH: $author$project$Main$update, aI: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));