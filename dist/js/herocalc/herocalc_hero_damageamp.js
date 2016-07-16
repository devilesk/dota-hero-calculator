define(["require","exports","module","herocalc_knockout","./herocalc_core"],function(e,a,t){"use strict";var n=e("herocalc_knockout"),r=e("./herocalc_core").HEROCALCULATOR;r.prototype.HeroDamageAmpMixin=function(e){e.damageBrackets=[["medusa_mana_shield","templar_assassin_refraction","faceless_void_backtrack","nyx_assassin_spiked_carapace"],["spectre_dispersion","wisp_overcharge","slardar_sprint","bristleback_bristleback","undying_flesh_golem"],["abaddon_borrowed_time","abaddon_aphotic_shield","kunkka_ghostship","treant_living_armor"],["chen_penitence","medusa_stone_gaze","shadow_demon_soul_catcher"],["dazzle_shallow_grave"]],e.getDamageAfterBracket=function(a,t){for(var n=e.damageBrackets[t],o=1,c=0;c<n.length;c++)(void 0!=r.prototype.findWhere(e.damageAmplification.buffs,{name:n[c].name})||void 0!=r.prototype.findWhere(e.damageReduction.buffs,{name:n[c].name}))&&(o+=n[c].value);return a*o},e.processDamageAmpReducBracket=function(a,t,n){for(var o=1,c=[],n=parseFloat(n),s=parseFloat(n),i=0;i<e.damageBrackets[a].length;i++)void 0!=t[e.damageBrackets[a][i]]&&(o=1+parseFloat(t[e.damageBrackets[a][i]].multiplier),s+=n*o-n,c.push(new r.prototype.DamageInstance(t[e.damageBrackets[a][i]].displayname,t[e.damageBrackets[a][i]].damageType,n*o-n,[],s)));return c},e.getDamageAmpReducInstance=function(a,t,n,o){var c=[],s=parseFloat(t),i="initial"==n?"Initial":a[n].displayname;return c=c.concat(e.processDamageAmpReducBracket(0,a,s)),s=c[c.length-1]?c[c.length-1].total:s,c=c.concat(e.processDamageAmpReducBracket(1,a,s)),s=c[c.length-1]?c[c.length-1].total:s,c=c.concat(e.processDamageAmpReducBracket(2,a,s)),s=c[c.length-1]?c[c.length-1].total:s,new r.prototype.DamageInstance(i,o,t,c,c[c.length-1]?c[c.length-1].total:s)},e.getDamageAmpReduc=function(a){var t=[],n={},o=e.damageReduction.getDamageMultiplierSources(),c=e.damageAmplification.getDamageMultiplierSources();$.extend(n,o),$.extend(n,c),t.push(e.getDamageAmpReducInstance(n,a,"initial","physical"));for(var s=["shadow_demon_soul_catcher","medusa_stone_gaze","chen_penitence"],i=0;i<s.length;i++)void 0!=n[s[i]]&&t.push(e.getDamageAmpReducInstance(n,a*n[s[i]].multiplier,s[i],n[s[i]].damageType));return new r.prototype.DamageInstance("Total","physical",a,t,t.reduce(function(e,a){return parseFloat(e)+parseFloat(a.total)},0))},e.damageInputModified=n.computed(function(){return e.getDamageAmpReduc(e.damageInputValue())})}});