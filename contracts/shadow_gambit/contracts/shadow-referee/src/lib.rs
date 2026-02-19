#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Bytes, String};

mod game_hub {
    soroban_sdk::contractimport!(
        file = "../../game_hub.wasm" 
    );
}

#[contract]
pub struct ShadowReferee;

#[contractimpl]
impl ShadowReferee {
    pub fn start_match(env: Env, player: Address) {
        player.require_auth();

        // Using Address::from_string instead of from_str for modern SDK compatibility
        let hub_addr = Address::from_string(&String::from_str(&env, "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG"));
        let hub_client = game_hub::Client::new(&env, &hub_addr);
        
        let game_id: u32 = 1;
        let dummy_address = hub_addr.clone();
        let amount: i128 = 0;

        hub_client.start_game(
            &player, 
            &game_id, 
            &dummy_address, 
            &dummy_address, 
            &amount, 
            &amount
        );

        env.storage().instance().set(&symbol_short!("player"), &player);
    }

    // UPDATED: Accepting the proof and the new hash coordinate
    pub fn submit_move(env: Env, _proof: Bytes, new_hash: Bytes) {
        // Logic: In a full Vortex implementation, you would call a Noir Verifier WASM here.
        // For now, we update the state to verify the pipeline is open.
        env.storage().instance().set(&symbol_short!("curr_pos"), &new_hash);
        
        // Emit event so frontend knows move was recorded on-chain
        env.events().publish((symbol_short!("moved"),), new_hash);
    }

    pub fn end_match(env: Env) {
        let hub_addr = Address::from_string(&String::from_str(&env, "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG"));
        let hub_client = game_hub::Client::new(&env, &hub_addr);
        
        let game_id: u32 = 1;
        let is_winner: bool = true; 

        hub_client.end_game(&game_id, &is_winner);
    }
}