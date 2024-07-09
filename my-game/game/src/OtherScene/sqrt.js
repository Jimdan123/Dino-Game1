
function mySqrt(a)
{
    cc.log("Hello mySqrt. Find square root of integer: " + a);

    if (a == 0 || a == 1)
    {
        return a;
    }

    // guess square root = a/2
    var r = a/2;

    for (var i = 1; i <= 3; i++)
    {
        cc.log("round " + i + ":");
        cc.log("    r = " + r);
        cc.log("    r*r = " + r*r);

        var a_div_r = a/r;
        cc.log("    a/r = " + a_div_r);

        var new_r = (r + a_div_r)/2;
        cc.log("    (r + a/r)/2 = " + new_r);

        r = new_r;
    }

    return r;
}