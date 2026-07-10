const mineflayer = require('mineflayer');
const { mineflayer: viewer } = require('prismarine-viewer');
const localtunnel = require('localtunnel');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue } = require('firebase/database');

// Secret içindeki JSON'ı okur
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function startBot() {
    const bot = mineflayer.createBot({ 
        host: 'Verity-PGWq.aternos.me', 
        port: 25565, 
        username: 'Kole',
        version: false 
    });

    bot.on('spawn', async () => {
        console.log("Bot oyuna girdi!");
        viewer(bot, { port: 3000, firstPerson: true });
        
        const tunnel = await localtunnel({ port: 3000 });
        console.log("!!! GÖZLEM LİNKİN: " + tunnel.url + " !!!");

        const keyMap = { w: 'forward', a: 'left', s: 'back', d: 'right', space: 'jump', shift: 'sneak', ctrl: 'sprint' };
        
        onValue(ref(db, 'controller'), (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            
            // Klavye
            for (let key in data.keys) {
                if (keyMap[key]) bot.setControlState(keyMap[key], data.keys[key]);
            }
            // Mouse
            if (data.look) bot.look(data.look.yaw, data.look.pitch, true);
        });
    });

    bot.on('end', () => setTimeout(startBot, 5000));
    bot.on('error', () => setTimeout(startBot, 5000));
}
startBot();
