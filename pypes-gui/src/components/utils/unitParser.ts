export function convertUnits(clean_units:string) {
    if (
        clean_units === "mgd" ||
        clean_units === "milliongalperday" ||
        clean_units === "milliongal/day" ||
        clean_units === "10**6gal/day" ||
        clean_units === "milliongallonperday" ||
        clean_units === "milliongallon/day" ||
        clean_units === "10**6gallon/day" ||
        clean_units === "milliongallonsperday" ||
        clean_units === "milliongallons/day" ||
        clean_units === "10**6gallons/day" ||
        clean_units === "milliongalperd" ||
        clean_units === "milliongal/d" ||
        clean_units === "10**6gal/d" ||
        clean_units === "milliongallonperd" ||
        clean_units === "milliongallon/d" ||
        clean_units === "10**6gallon/d" ||
        clean_units === "milliongallonsperd" ||
        clean_units === "milliongallons/d" ||
        clean_units === "10**6gallons/d"
    ) {
        return "milliongallons/day";
    } else if (
        clean_units === "cubicmeters" ||
        clean_units === "cubicmeter" ||
        clean_units === "m**3" ||
        clean_units === "m^3" ||
        clean_units === "m3" ||
        clean_units === "meter3" ||
        clean_units === "meter**3" ||
        clean_units === "meter^3" ||
        clean_units === "meters3" ||
        clean_units === "meters**3" ||
        clean_units === "meters^3"
    ) {
        return "cubicmeters";
    } else if (clean_units === "horsepower" || clean_units === "hp") {
        return "horsepower";
    } else if (
        clean_units === "scfm" ||
        clean_units === "cfm" ||
        clean_units === "cubicfeet/min" ||
        clean_units === "cubicfoot/min" ||
        clean_units === "ft3/min" ||
        clean_units === "ft**3/min" ||
        clean_units === "ft^3/min" ||
        clean_units === "foot3/min" ||
        clean_units === "foot^3/min" ||
        clean_units === "foot**3/min" ||
        clean_units === "feet3/min" ||
        clean_units === "feet**3/min" ||
        clean_units === "feet^3/min" ||
        clean_units === "cubicfeet/minute" ||
        clean_units === "cubicfoot/minute" ||
        clean_units === "ft3/minute" ||
        clean_units === "ft**3/minute" ||
        clean_units === "ft^3/minute" ||
        clean_units === "foot3/minute" ||
        clean_units === "foot^3/minute" ||
        clean_units === "foot**3/minute" ||
        clean_units === "feet3/minute" ||
        clean_units === "feet**3/minute" ||
        clean_units === "feet^3/minute"
    ) {
        return "cubicfeet/min";
    } else if (
        clean_units === "scf" ||
        clean_units === "cubicfeet" ||
        clean_units === "cubicfoot" ||
        clean_units === "ft3" ||
        clean_units === "ft**3" ||
        clean_units === "ft^3" ||
        clean_units === "foot3" ||
        clean_units === "foot**3" ||
        clean_units === "foot^3" ||
        clean_units === "feet3" ||
        clean_units === "feet**3" ||
        clean_units === "feet^3"
    ) {
        return "cubicfeet";
    } else if (
        clean_units === "gpm" ||
        clean_units === "galpermin" ||
        clean_units === "gallonpermin" ||
        clean_units === "gallonspermin" ||
        clean_units === "galperminute" ||
        clean_units === "gallonperminute" ||
        clean_units === "gallonsperminute" ||
        clean_units === "gal/min" ||
        clean_units === "gal/minute" ||
        clean_units === "gallon/min" ||
        clean_units === "gallon/minute" ||
        clean_units === "gallons/min" ||
        clean_units === "gallons/minute"
    ) {
        return "gallon/min";
    } else if (
        clean_units === "gal" ||
        clean_units === "gallon" ||
        clean_units === "gallons"
    ) {
        return "gallon";
    } else if (
        clean_units === "gpd" ||
        clean_units === "galperday" ||
        clean_units === "gallonperday" ||
        clean_units === "gallonsperday" ||
        clean_units === "gal/d" ||
        clean_units === "gal/day" ||
        clean_units === "gallon/d" ||
        clean_units === "gallon/day" ||
        clean_units === "gallons/d" ||
        clean_units === "gallons/day" ||
        clean_units === "gallon / day"
    ) {
        return "gallon/day";
    } else if (
        clean_units === "m/s" ||
        clean_units === "meter/s" ||
        clean_units === "meters/s" ||
        clean_units === "m/second" ||
        clean_units === "meter/second" ||
        clean_units === "meters/second"
    ) {
        return "meter/second";
    } else if (
        clean_units === "cubicmeters/day" ||
        clean_units === "cubicmeter/day" ||
        clean_units === "m**3/day" ||
        clean_units === "m^3/day" ||
        clean_units === "m3/day" ||
        clean_units === "meter3/day" ||
        clean_units === "meter**3/day" ||
        clean_units === "meter^3/day" ||
        clean_units === "meters3/day" ||
        clean_units === "meters**3/day" ||
        clean_units === "meters^3/day" ||
        clean_units === "cubicmeters/d" ||
        clean_units === "cubicmeter/d" ||
        clean_units === "m**3/d" ||
        clean_units === "m^3/d" ||
        clean_units === "m3/d" ||
        clean_units === "meter3/d" ||
        clean_units === "meter**3/d" ||
        clean_units === "meter^3/d" ||
        clean_units === "meters3/d" ||
        clean_units === "meters**3/d" ||
        clean_units === "meters^3/d"
    ) {
        return "cubicmeters/day";
    } else if (
        clean_units === "psi" ||
        clean_units === "poundspersquareinch" ||
        clean_units === "poundpersquareinch" ||
        clean_units === "poundspersquarein" ||
        clean_units === "poundpersquarein" ||
        clean_units === "poundspersqin" ||
        clean_units === "poundpersqin" ||
        clean_units === "pound/inch**2" ||
        clean_units === "pounds/inch**2" ||
        clean_units === "lbs/inch**2" ||
        clean_units === "lb/inch**2" ||
        clean_units === "pound/inch^2" ||
        clean_units === "pounds/inch^2" ||
        clean_units === "lbs/inch^2" ||
        clean_units === "lb/inch^2" ||
        clean_units === "pound/squareinch" ||
        clean_units === "pounds/squareinch" ||
        clean_units === "lbs/squareinch" ||
        clean_units === "lb/squareinch" ||
        clean_units === "pound/in**2" ||
        clean_units === "pounds/in**2" ||
        clean_units === "lbs/in**2" ||
        clean_units === "lb/in**2" ||
        clean_units === "pound/in^2" ||
        clean_units === "pounds/in^2" ||
        clean_units === "lbs/in^2" ||
        clean_units === "lb/in^2"
    ) {
        return "pound/squareinch";
    } else if (
        clean_units === "btu" ||
        clean_units === "btus" ||
        clean_units === "britishthermalunit" ||
        clean_units === "britishthermalunits"
    ) {
        return "britishthermalunits";
    } else if (
        clean_units === "btu/scf" ||
        clean_units === "btus/scf" ||
        clean_units === "britishthermalunit/scf" ||
        clean_units === "britishthermalunits/scf" ||
        clean_units === "btu/cubicfeet" ||
        clean_units === "btus/cubicfeet" ||
        clean_units === "britishthermalunit/cubicfeet" ||
        clean_units === "britishthermalunits/cubicfeet" ||
        clean_units === "btu/cubicfoot" ||
        clean_units === "btus/cubicfoot" ||
        clean_units === "britishthermalunit/cubicfoot" ||
        clean_units === "britishthermalunits/cubicfoot" ||
        clean_units === "btu/ft3" ||
        clean_units === "btus/ft3" ||
        clean_units === "britishthermalunit/ft3" ||
        clean_units === "britishthermalunits/ft3" ||
        clean_units === "btu/ft**3" ||
        clean_units === "btus/ft**3" ||
        clean_units === "britishthermalunit/ft**3" ||
        clean_units === "britishthermalunits/ft**3" ||
        clean_units === "btu/ft^3" ||
        clean_units === "btus/ft^3" ||
        clean_units === "britishthermalunit/ft^3" ||
        clean_units === "britishthermalunits/ft^3" ||
        clean_units === "btu/foot3" ||
        clean_units === "btus/foot3" ||
        clean_units === "britishthermalunit/foot3" ||
        clean_units === "britishthermalunits/foot3" ||
        clean_units === "btu/foot**3" ||
        clean_units === "btus/foot**3" ||
        clean_units === "britishthermalunit/foot**3" ||
        clean_units === "britishthermalunits/foot**3" ||
        clean_units === "btu/feet3" ||
        clean_units === "btus/feet3" ||
        clean_units === "britishthermalunit/feet3" ||
        clean_units === "britishthermalunits/feet3" ||
        clean_units === "btu/foot^3" ||
        clean_units === "btus/foot^3" ||
        clean_units === "britishthermalunit/foot^3" ||
        clean_units === "britishthermalunits/foot^3" ||
        clean_units === "btu/feet**3" ||
        clean_units === "btus/feet**3" ||
        clean_units === "britishthermalunit/feet**3" ||
        clean_units === "britishthermalunits/feet**3" ||
        clean_units === "btu/feet^3" ||
        clean_units === "btus/feet^3" ||
        clean_units === "britishthermalunit/feet^3" ||
        clean_units === "britishthermalunits/feet^3" ||
        clean_units === "btu/feet**3" ||
        clean_units === "btus/feet**3" ||
        clean_units === "britishthermalunit/feet**3" ||
        clean_units === "britishthermalunits/feet**3" ||
        clean_units === "btu/feet^3" ||
        clean_units === "btus/feet^3" ||
        clean_units === "britishthermalunit/feet^3" ||
        clean_units === "britishthermalunits/feet^3" ||
        clean_units === "btu/feet^3" ||
        clean_units === "btus/feet^3" ||
        clean_units === "britishthermalunit/feet^3" ||
        clean_units === "britishthermalunits/feet^3"
    ) {
        return "britishthermalunits/cubicfeet";
    } else if (
        clean_units === "kwh" ||
        clean_units === "kwhr" ||
        clean_units === "kilowatthr" ||
        clean_units === "hour*kilowatt" ||
        clean_units === "kilowatt*hour" ||
        clean_units === "kilowatthour"
    ) {
        return "kwh";
    } else if (
        clean_units === "kilowatt*hour/meter**3" ||
        clean_units === "hour*kilowatt/meter**3" ||
        clean_units === "kwh/meter**3" ||
        clean_units === "kwhr/meter**3" ||
        clean_units === "kilowatthr/meter**3" ||
        clean_units === "kilowatthour/meter**3" ||
        clean_units === "kilowatt*hour/m^3" ||
        clean_units === "hour*kilowatt/m^3" ||
        clean_units === "kwh/m^3" ||
        clean_units === "kwhr/m^3" ||
        clean_units === "kilowatthr/m^3" ||
        clean_units === "kilowatthour/m^3" ||
        clean_units === "kilowatt*hour/cubicmeters" ||
        clean_units === "hour*kilowatt/cubicmeters" ||
        clean_units === "kwh/cubicmeters" ||
        clean_units === "kwhr/cubicmeters" ||
        clean_units === "kilowatthr/cubicmeters" ||
        clean_units === "kilowatthour/cubicmeters" ||
        clean_units === "kilowatt*hour/cubicmeter" ||
        clean_units === "hour*kilowatt/cubicmeter" ||
        clean_units === "kwh/cubicmeter" ||
        clean_units === "kwhr/cubicmeter" ||
        clean_units === "kilowatthr/cubicmeter" ||
        clean_units === "kilowatthour/cubicmeter" ||
        clean_units === "kilowatt*hour/m**3" ||
        clean_units === "hour*kilowatt/m**3" ||
        clean_units === "kwh/m**3" ||
        clean_units === "kwhr/m**3" ||
        clean_units === "kilowatthr/m**3" ||
        clean_units === "kilowatthour/m**3" ||
        clean_units === "kilowatt*hour/m3" ||
        clean_units === "hour*kilowatt/m3" ||
        clean_units === "kwh/m3" ||
        clean_units === "kwhr/m3" ||
        clean_units === "kilowatthr/m3" ||
        clean_units === "kilowatthour/m3" ||
        clean_units === "kilowatt*hour/meter3" ||
        clean_units === "hour*kilowatt/meter3" ||
        clean_units === "kwh/meter3" ||
        clean_units === "kwhr/meter3" ||
        clean_units === "kilowatthr/meter3" ||
        clean_units === "kilowatthour/meter3" ||
        clean_units === "kilowatt*hour/meter^3" ||
        clean_units === "hour*kilowatt/meter^3" ||
        clean_units === "kwh/meter^3" ||
        clean_units === "kwhr/meter^3" ||
        clean_units === "kilowatthr/meter^3" ||
        clean_units === "kilowatthour/meter^3" ||
        clean_units === "kilowatt*hour/meters3" ||
        clean_units === "hour*kilowatt/meters3" ||
        clean_units === "kwh/meters3" ||
        clean_units === "kwhr/meters3" ||
        clean_units === "kilowatthr/meters3" ||
        clean_units === "kilowatthour/meters3" ||
        clean_units === "kilowatt*hour/meters**3" ||
        clean_units === "hour*kilowatt/meters**3" ||
        clean_units === "kwh/meters**3" ||
        clean_units === "kwhr/meters**3" ||
        clean_units === "kilowatthr/meters**3" ||
        clean_units === "kilowatthour/meters**3" ||
        clean_units === "kilowatt*hour/meters^3" ||
        clean_units === "hour*kilowatt/meters^3" ||
        clean_units === "kwh/meters^3" ||
        clean_units === "kwhr/meters^3" ||
        clean_units === "kilowatthr/meters^3" ||
        clean_units === "kilowatthour/meters^3" ||
        clean_units === "kilowatt*hour/meters^3" ||
        clean_units === "hour*kilowatt/meters^3" ||
        clean_units === "kwh/meters^3" ||
        clean_units === "kwhr/meters^3" ||
        clean_units === "kilowatthr/meters^3" ||
        clean_units === "kilowatthour/meters^3"
    ) {
        return "kwh/cubicmeters";
    } else if (clean_units === "kw" || clean_units === "kilowatt") {
        return "kW";
    } else if (
        clean_units === "meters" ||
        clean_units === "m" ||
        clean_units === "meter"
    ) {
        return "meters";
    } else if (
        clean_units === "inches" ||
        clean_units === "in" ||
        clean_units === "inch"
    ) {
        return "inches";
    } else return ""
}
