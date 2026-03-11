import { createInterface } from 'readline';
import * as nr7TargetProgress   from './nr7-section-III-target-progress.ts';
import * as publishedCommitments from './published-commitments.ts';

interface Extract {
    name       : string;
    description: string;
    run        : () => Promise<void>;
}

const extracts: Extract[] = [
    {
        name       : 'NR7 Section III – Target Progress',
        description: 'Exports NR7 national reports Section III target progress aligned to GBF Target 14',
        run        : nr7TargetProgress.run,
    },
    {
        name       : 'Published Commitments',
        description: 'Exports all published stakeholder commitments with organization, coverage, and GBF alignment details',
        run        : publishedCommitments.run,
    },
];

function prompt(question: string): Promise<string> {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function printMenu(): void {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║             ORT Data Extract Runner                 ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
    console.log('Available extracts:\n');
    extracts.forEach((e, i) => {
        console.log(`  [${i + 1}] ${e.name}`);
        console.log(`      ${e.description}\n`);
    });
    console.log(`  [0] Exit\n`);
}

async function main(): Promise<void> {
    printMenu();

    const answer = await prompt('Select an extract to run (number): ');
    const choice = parseInt(answer, 10);

    if (answer === '0' || isNaN(choice)) {
        console.log('Exiting.');
        process.exit(0);
    }

    const extract = extracts[choice - 1];
    if (!extract) {
        console.error(`Invalid selection: "${answer}"`);
        process.exit(1);
    }

    console.log(`\nRunning: ${extract.name}\n${'─'.repeat(54)}`);
    await extract.run();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
