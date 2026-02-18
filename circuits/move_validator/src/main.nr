use dep::std;

fn main(
    old_x: u32, 
    old_y: u32, 
    new_x: u32, 
    new_y: u32, 
    old_pos_hash: pub Field, 
    new_pos_hash: pub Field 
) {
    let check_old = std::hash::poseidon::bn254::hash_2([old_x as Field, old_y as Field]);
    // This is the one we already solved
    assert(check_old == old_pos_hash);

    let check_new = std::hash::poseidon::bn254::hash_2([new_x as Field, new_y as Field]);
    
    // DEBUG: This will print the hash for (0, 1)
    std::println(check_new); 

    assert(check_new == new_pos_hash);

    let dist_x = if new_x > old_x { new_x - old_x } else { old_x - new_x };
    let dist_y = if new_y > old_y { new_y - old_y } else { old_y - new_y };
    assert(dist_x + dist_y == 1);
}