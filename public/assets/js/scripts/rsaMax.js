

rsaMax = {
    publicKey: function (bits, n, e) {
        this.bits = bits;
        this.n = n;
        this.e = e;
    },
    privateKey: function (p, q, d, publicKey) {
        this.p = p;
        this.q = q;
        this.d = d;
        this.publicKey = publicKey;
    },
    prime:function(bitLength){
        var rnd = BigInteger.zero;
        var isPrime = false;
        var two = new BigInteger(2);

        while(!isPrime){
            rnd = bigInt.randBetween(two.pow(bitLength - 1), two.pow(bitLength));
                if(rnd.isProbablePrime()){
                isPrime = true;
            }
        }
    },

eGcd: function(a, b){
    var x = BigInteger.zero;
    var y = BigInteger.one;
    var u = BigInteger.one;
    var v = BigInteger.zero;

    while (a.notEquals(BigInteger.zero)) {
        var modDiv = b.divmod(a);
        var q = modDiv.quotient;
        var r = modDiv.remainder;
        var m = x.minus(u.multiply(q));
        var n = y.minus(v.multiply(q));
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return {
        b: b,
        x: x,
        y: y
    }
},

modInv: function (a, n) {
    var egcd = this.eGcd(a, n);
    if (egcd.b.notEquals(bigInt.one)) {
        return null; // modular inverse does not exist
    } else {
        var ret = egcd.x.mod(n);
        if (ret.isNegative()) {
            ret = ret.add(n);
        }
        return ret;
    }
},

generateKeys: function(bitlength) {
    var p, q, n, phi, e, d, keys = {};
    // if p and q are bitlength/2 long, n is then bitlength long
    this.bitlength = bitlength || 2048;
    console.log("Generating rsaMax keys of", this.bitlength, "bits");
    p = BigInteger.prime(this.bitlength / 2);
    do {
        q = BigInteger.prime(this.bitlength / 2);
    } while (q.compare(p) === 0);
    n = p.multiply(q);

    phi = p.subtract(1).multiply(q.subtract(1));

    e = BigInteger(65537);
    d = BigInteger.modInv(e, phi);

    keys.publicKey = new rsaMax.publicKey(this.bitlength, n, e);
    keys.privateKey = new rsaMax.privateKey(p, q, d, keys.publicKey);
    return keys;
}
};


rsaMax.publicKey.prototype = {
    encrypt: function(m) {
        return m.modPow(this.e, this.n);
    },
    decrypt: function(c) {
        return c.modPow(this.e, this.n);
    }
};

rsaMax.privateKey.prototype = {
    encrypt: function(m) {
        return m.modPow(this.d, this.publicKey.n);
    },
    decrypt: function(c) {
        return c.modPow(this.d, this.publicKey.n);
    }
};
