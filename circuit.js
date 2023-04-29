// const circuit = `
// import "hashes/sha256/512bitPacked" as sha256packed;
// def main(private field a, private field b, private field c, private field d) {
//     field[2] h = sha256packed([a, b, c, d]);
//     assert(h[0] == 263561599766550617289250058199814760685);
//     assert(h[1] == 65303172752238645975888084098459749904);
//     return;
// }`;

const circuit = `
import "hashes/sha256/512bitPacked" as sha256packed;
import "utils/casts/field_to_u64" as field_to_u64;
def main(private field privateKey, private field primeDivider, private field modulus) -> bool
{
    return field_to_u64(modulus) == field_to_u64(privateKey) % field_to_u64(primeDivider);
}`;

export default circuit;