use std::hash;

fn main(
    old_x: u32, 
    old_y: u32, 
    new_x: u32, 
    new_y: u32, 
    old_pos_hash: pub Field, 
    new_pos_hash: pub Field 
) {
    // Pedersen is highly compatible and great for coordinate hashing
    let check_old = hash::pedersen_commitment([old_x as Field, old_y as Field]).x;
    assert(check_old == old_pos_hash);

    let check_new = hash::pedersen_commitment([new_x as Field, new_y as Field]).x;
    assert(check_new == new_pos_hash);

    // Rule: Move must be exactly 1 tile
    let dist_x = if new_x > old_x { new_x - old_x } else { old_x - new_x };
    let dist_y = if new_y > old_y { new_y - old_y } else { old_y - new_y };
    
    assert(dist_x + dist_y == 1);
}