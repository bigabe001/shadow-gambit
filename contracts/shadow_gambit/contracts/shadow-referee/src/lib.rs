#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Bytes};

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

        let hub_addr = Address::from_str(&env, "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG");
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

    pub fn submit_move(env: Env, _proof: Bytes, new_hash: Bytes) {
        env.storage().instance().set(&symbol_short!("curr_pos"), &new_hash);
    }

    pub fn end_match(env: Env) {
        let hub_addr = Address::from_str(&env, "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG");
        let hub_client = game_hub::Client::new(&env, &hub_addr);
        
        // FIX: The Hub requires Game ID and a boolean (win/loss)
        let game_id: u32 = 1;
        let is_winner: bool = true; 

        hub_client.end_game(&game_id, &is_winner);
    }
}