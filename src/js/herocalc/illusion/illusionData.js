var illusionData = {
    chaos_knight_phantasm: {
        hero: 'chaos_knight',
        displayName: 'Chaos Knight Phantasm',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    naga_siren_mirror_image: {
        hero: 'naga_siren',
        displayName: 'Naga Siren Mirror Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    dark_seer_wall_of_replica: {
        hero: 'dark_seer',
        displayName: 'Dark Seer Wall of Replica',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'replica_damage_outgoing',
        incoming_damage: 'replica_damage_incoming',
        outgoing_damage_scepter: 'replica_damage_outgoing_scepter'
    },
    morphling_replicate: {
        hero: 'morphling',
        displayName: 'Morphling Replicate',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'
    },
    phantom_lancer_doppelwalk: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Doppelwalk',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_juxtapose: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Juxtapose',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_spirit_lance: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Spirit Lance',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    shadow_demon_disruption: {
        hero: 'shadow_demon',
        displayName: 'Shadow Demon Disruption',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    spectre_haunt: {
        hero: 'spectre',
        displayName: 'Spectre Haunt',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'illusion_damage_outgoing',
        incoming_damage: 'illusion_damage_incoming'        
    },
    terrorblade_conjure_image: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Conjure Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    terrorblade_reflection: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Reflection',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage'     
    },
    item_manta: {
        hero: '',
        is_item: true,
        displayName: 'Manta Style Illusion',
        use_selected_hero: true,
        max_level: 1,
        outgoing_damage_melee: 'images_do_damage_percent_melee',
        incoming_damage_melee: 'images_take_damage_percent_melee',
        outgoing_damage_ranged: 'images_do_damage_percent_ranged',
        incoming_damage_ranged: 'images_take_damage_percent_ranged'
    }
}

module.exports = illusionData;