import { z } from "zod";

const sSchema = z.string();

const parse = (i) => {
    try {
        const y = sSchema.parse(i)
        console.log('parsed result: ', y);
    } catch (e) {
        console.log('error to parse: ', i)
    }
}

parse("david");
parse(12);

console.log(sSchema.safeParse('DAVID'));
console.log(sSchema.safeParse(18));
