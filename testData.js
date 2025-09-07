const testData = {
    sets: {
        A: {
            name: "Level A",
            description: "Simple pattern completion",
            questions: [
                {
                    id: "A1",
                    pattern: "simple-dots",
                    matrix: [
                        ["dot", "dots-2", "dots-3"],
                        ["dots-2", "dots-3", "dots-4"],
                        ["dots-3", "dots-4", "missing"]
                    ],
                    options: ["dots-5", "dots-4", "dots-6", "dot", "dots-3", "dots-2"],
                    correct: 1,
                    explanation: "Each row increases by one dot, so the missing piece should have 5 dots."
                },
                {
                    id: "A2", 
                    pattern: "shape-sequence",
                    matrix: [
                        ["triangle", "square", "circle"],
                        ["square", "circle", "triangle"],
                        ["circle", "triangle", "missing"]
                    ],
                    options: ["triangle", "square", "circle", "diamond", "star", "hexagon"],
                    correct: 1,
                    explanation: "Each row cycles through triangle, square, circle in different orders."
                },
                {
                    id: "A3",
                    pattern: "line-pattern",
                    matrix: [
                        ["vertical-line", "horizontal-line", "diagonal-line"],
                        ["horizontal-line", "diagonal-line", "vertical-line"],
                        ["diagonal-line", "vertical-line", "missing"]
                    ],
                    options: ["vertical-line", "horizontal-line", "diagonal-line", "cross", "dot", "empty"],
                    correct: 1,
                    explanation: "Pattern follows a rotation sequence of line orientations."
                },
                {
                    id: "A4",
                    pattern: "size-progression",
                    matrix: [
                        ["small-circle", "medium-circle", "large-circle"],
                        ["medium-circle", "large-circle", "small-circle"],
                        ["large-circle", "small-circle", "missing"]
                    ],
                    options: ["small-circle", "medium-circle", "large-circle", "dot", "empty", "huge-circle"],
                    correct: 1,
                    explanation: "Each row contains all three sizes in different arrangements."
                },
                {
                    id: "A5",
                    pattern: "fill-pattern",
                    matrix: [
                        ["empty-square", "half-filled-square", "filled-square"],
                        ["half-filled-square", "filled-square", "empty-square"],
                        ["filled-square", "empty-square", "missing"]
                    ],
                    options: ["empty-square", "half-filled-square", "filled-square", "quarter-filled", "striped", "dotted"],
                    correct: 1,
                    explanation: "Pattern cycles through different fill states."
                },
                {
                    id: "A6",
                    pattern: "direction-arrows",
                    matrix: [
                        ["arrow-up", "arrow-right", "arrow-down"],
                        ["arrow-right", "arrow-down", "arrow-left"],
                        ["arrow-down", "arrow-left", "missing"]
                    ],
                    options: ["arrow-up", "arrow-right", "arrow-down", "arrow-left", "arrow-diagonal", "circle"],
                    correct: 0,
                    explanation: "Arrows rotate clockwise in each position."
                },
                {
                    id: "A7",
                    pattern: "number-dots",
                    matrix: [
                        ["one-dot", "two-dots", "three-dots"],
                        ["two-dots", "three-dots", "four-dots"],
                        ["three-dots", "four-dots", "missing"]
                    ],
                    options: ["four-dots", "five-dots", "six-dots", "one-dot", "two-dots", "seven-dots"],
                    correct: 1,
                    explanation: "Each position increases by one dot from the previous row."
                },
                {
                    id: "A8",
                    pattern: "position-shift",
                    matrix: [
                        ["dot-left", "dot-center", "dot-right"],
                        ["dot-center", "dot-right", "dot-left"],
                        ["dot-right", "dot-left", "missing"]
                    ],
                    options: ["dot-left", "dot-center", "dot-right", "two-dots", "empty", "dot-corner"],
                    correct: 1,
                    explanation: "Dot position shifts one place to the right each row."
                },
                {
                    id: "A9",
                    pattern: "simple-addition",
                    matrix: [
                        ["one-line", "two-lines", "three-lines"],
                        ["two-lines", "three-lines", "four-lines"],
                        ["three-lines", "four-lines", "missing"]
                    ],
                    options: ["three-lines", "four-lines", "five-lines", "six-lines", "one-line", "two-lines"],
                    correct: 2,
                    explanation: "Number of lines increases by one in each position."
                },
                {
                    id: "A10",
                    pattern: "rotation-simple",
                    matrix: [
                        ["triangle-up", "triangle-right", "triangle-down"],
                        ["triangle-right", "triangle-down", "triangle-left"],
                        ["triangle-down", "triangle-left", "missing"]
                    ],
                    options: ["triangle-up", "triangle-right", "triangle-down", "triangle-left", "square", "circle"],
                    correct: 0,
                    explanation: "Triangle rotates 90 degrees clockwise in each step."
                },
                {
                    id: "A11",
                    pattern: "symmetry-pattern",
                    matrix: [
                        ["left-half", "full-shape", "right-half"],
                        ["top-half", "full-shape", "bottom-half"],
                        ["diagonal-half", "full-shape", "missing"]
                    ],
                    options: ["left-half", "right-half", "opposite-diagonal", "full-shape", "empty", "quarter"],
                    correct: 2,
                    explanation: "Each row shows different halves paired with the full shape."
                },
                {
                    id: "A12",
                    pattern: "completion-sequence",
                    matrix: [
                        ["quarter-circle", "half-circle", "three-quarter-circle"],
                        ["half-circle", "three-quarter-circle", "full-circle"],
                        ["three-quarter-circle", "full-circle", "missing"]
                    ],
                    options: ["quarter-circle", "half-circle", "three-quarter-circle", "full-circle", "empty", "double-circle"],
                    correct: 0,
                    explanation: "Pattern completes the circle progression by returning to the beginning."
                }
            ]
        },
        B: {
            name: "Level B",
            description: "Pattern completion with spatial relationships",
            questions: Array.from({length: 12}, (_, i) => ({
                id: `B${i+1}`,
                pattern: "spatial-relationship",
                matrix: [
                    ["pattern-1", "pattern-2", "pattern-3"],
                    ["pattern-4", "pattern-5", "pattern-6"],
                    ["pattern-7", "pattern-8", "missing"]
                ],
                options: ["option-1", "option-2", "option-3", "option-4", "option-5", "option-6"],
                correct: Math.floor(Math.random() * 6),
                explanation: `Pattern involves spatial relationship analysis for problem B${i+1}.`
            }))
        },
        C: {
            name: "Level C", 
            description: "Progressive change patterns",
            questions: Array.from({length: 12}, (_, i) => ({
                id: `C${i+1}`,
                pattern: "progressive-change",
                matrix: [
                    ["change-1", "change-2", "change-3"],
                    ["change-4", "change-5", "change-6"],
                    ["change-7", "change-8", "missing"]
                ],
                options: ["option-1", "option-2", "option-3", "option-4", "option-5", "option-6", "option-7", "option-8"],
                correct: Math.floor(Math.random() * 8),
                explanation: `Pattern involves progressive change analysis for problem C${i+1}.`
            }))
        },
        D: {
            name: "Level D",
            description: "Quantitative and qualitative progression",
            questions: Array.from({length: 12}, (_, i) => ({
                id: `D${i+1}`,
                pattern: "quantitative-progression", 
                matrix: [
                    ["quant-1", "quant-2", "quant-3"],
                    ["quant-4", "quant-5", "quant-6"],
                    ["quant-7", "quant-8", "missing"]
                ],
                options: ["option-1", "option-2", "option-3", "option-4", "option-5", "option-6", "option-7", "option-8"],
                correct: Math.floor(Math.random() * 8),
                explanation: `Pattern involves quantitative progression for problem D${i+1}.`
            }))
        },
        E: {
            name: "Level E",
            description: "Complex analogical reasoning",
            questions: Array.from({length: 12}, (_, i) => ({
                id: `E${i+1}`,
                pattern: "analogical-reasoning",
                matrix: [
                    ["analogy-1", "analogy-2", "analogy-3"],
                    ["analogy-4", "analogy-5", "analogy-6"],
                    ["analogy-7", "analogy-8", "missing"]
                ],
                options: ["option-1", "option-2", "option-3", "option-4", "option-5", "option-6", "option-7", "option-8"],
                correct: Math.floor(Math.random() * 8),
                explanation: `Pattern involves complex analogical reasoning for problem E${i+1}.`
            }))
        }
    },

    // Answer key from the PDF
    answerKey: {
        A: [4, 5, 1, 2, 6, 3, 6, 2, 1, 3, 4, 5],
        B: [2, 6, 1, 2, 1, 3, 6, 2, 4, 3, 4, 5], 
        C: [8, 2, 3, 8, 7, 4, 8, 1, 7, 6, 1, 2],
        D: [3, 4, 3, 7, 8, 6, 5, 4, 1, 2, 6, 1],
        E: [7, 6, 8, 2, 1, 5, 1, 6, 3, 2, 4, 5]
    },

    // Percentile norms (simplified from PDF)
    percentileNorms: {
        8: { // Age 8
            percentiles: [
                {score: 12, percentile: 5},
                {score: 18, percentile: 10}, 
                {score: 23, percentile: 25},
                {score: 28, percentile: 50},
                {score: 33, percentile: 75},
                {score: 38, percentile: 90},
                {score: 42, percentile: 95}
            ]
        },
        11: { // Age 11  
            percentiles: [
                {score: 22, percentile: 5},
                {score: 28, percentile: 10},
                {score: 35, percentile: 25}, 
                {score: 42, percentile: 50},
                {score: 47, percentile: 75},
                {score: 52, percentile: 90},
                {score: 56, percentile: 95}
            ]
        },
        14: { // Age 14
            percentiles: [
                {score: 32, percentile: 5},
                {score: 37, percentile: 10},
                {score: 42, percentile: 25},
                {score: 47, percentile: 50}, 
                {score: 52, percentile: 75},
                {score: 56, percentile: 90},
                {score: 59, percentile: 95}
            ]
        },
        adult: { // Adult norms
            percentiles: [
                {score: 35, percentile: 5},
                {score: 40, percentile: 10},
                {score: 45, percentile: 25},
                {score: 50, percentile: 50},
                {score: 54, percentile: 75}, 
                {score: 57, percentile: 90},
                {score: 60, percentile: 95}
            ]
        }
    },

    // Pattern rendering functions
    patterns: {
        // Basic shapes
        'dot': () => `<div class="pattern-element"><div style="width: 20px; height: 20px; background: black; border-radius: 50%; margin: auto;"></div></div>`,
        
        'dots-2': () => `<div class="pattern-element">
            <div style="display: flex; gap: 10px; justify-content: center; align-items: center; height: 100%;">
                <div style="width: 15px; height: 15px; background: black; border-radius: 50%;"></div>
                <div style="width: 15px; height: 15px; background: black; border-radius: 50%;"></div>
            </div>
        </div>`,
        
        'dots-3': () => `<div class="pattern-element">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 5px;">
                <div style="width: 12px; height: 12px; background: black; border-radius: 50%;"></div>
                <div style="display: flex; gap: 8px;">
                    <div style="width: 12px; height: 12px; background: black; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: black; border-radius: 50%;"></div>
                </div>
            </div>
        </div>`,
        
        'dots-4': () => `<div class="pattern-element">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: fit-content; margin: auto; height: 100%; align-content: center;">
                <div style="width: 12px; height: 12px; background: black; border-radius: 50%;"></div>
                <div style="width: 12px; height: 12px; background: black; border-radius: 50%;"></div>
                <div style="width: 12px; height: 12px; background: black; border-radius: 50%;"></div>
                <div style="width: 12px; height: 12px; background: black; border-radius: 50%;"></div>
            </div>
        </div>`,
        
        'dots-5': () => `<div class="pattern-element">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; width: fit-content; margin: auto; height: 100%; align-content: center;">
                <div style="width: 10px; height: 10px; background: black; border-radius: 50%;"></div>
                <div style="width: 10px; height: 10px; background: black; border-radius: 50%;"></div>
                <div style="width: 10px; height: 10px; background: black; border-radius: 50%; grid-column: 1/-1; justify-self: center;"></div>
                <div style="width: 10px; height: 10px; background: black; border-radius: 50%;"></div>
                <div style="width: 10px; height: 10px; background: black; border-radius: 50%;"></div>
            </div>
        </div>`,
        
        // Shapes
        'triangle': () => `<div class="pattern-element">
            <div style="width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-bottom: 35px solid black; margin: auto; margin-top: 20%;"></div>
        </div>`,
        
        'square': () => `<div class="pattern-element">
            <div style="width: 30px; height: 30px; background: black; margin: auto;"></div>
        </div>`,
        
        'circle': () => `<div class="pattern-element">
            <div style="width: 30px; height: 30px; background: black; border-radius: 50%; margin: auto;"></div>
        </div>`,
        
        // Lines and orientations - constrained
        'horizontal-line': () => `<div class="pattern-element">
            <div style="width: 35px; height: 2px; background: black; margin: auto;"></div>
        </div>`,
        
        'vertical-line': () => `<div class="pattern-element">
            <div style="width: 2px; height: 35px; background: black; margin: auto;"></div>
        </div>`,
        
        'diagonal-line': () => `<div class="pattern-element">
            <div style="width: 35px; height: 35px; position: relative; margin: auto;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(45deg, transparent 48%, black 48%, black 52%, transparent 52%);"></div>
            </div>
        </div>`,
        
        // Size variations
        'small-circle': () => `<div class="pattern-element">
            <div style="width: 15px; height: 15px; background: black; border-radius: 50%; margin: auto;"></div>
        </div>`,
        
        'medium-circle': () => `<div class="pattern-element">
            <div style="width: 25px; height: 25px; background: black; border-radius: 50%; margin: auto;"></div>
        </div>`,
        
        'large-circle': () => `<div class="pattern-element">
            <div style="width: 35px; height: 35px; background: black; border-radius: 50%; margin: auto;"></div>
        </div>`,
        
        // Fill patterns
        'empty-square': () => `<div class="pattern-element">
            <div style="width: 30px; height: 30px; border: 2px solid black; margin: auto;"></div>
        </div>`,
        
        'half-filled-square': () => `<div class="pattern-element">
            <div style="width: 30px; height: 30px; border: 2px solid black; margin: auto; background: linear-gradient(to right, black 50%, white 50%);"></div>
        </div>`,
        
        'filled-square': () => `<div class="pattern-element">
            <div style="width: 30px; height: 30px; background: black; margin: auto;"></div>
        </div>`,
        
        // Arrow directions - size constrained
        'arrow-up': () => `<div class="pattern-element">
            <div style="margin: auto; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 15px solid black;"></div>
        </div>`,
        
        'arrow-down': () => `<div class="pattern-element">
            <div style="margin: auto; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 15px solid black;"></div>
        </div>`,
        
        'arrow-left': () => `<div class="pattern-element">
            <div style="margin: auto; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 15px solid black;"></div>
        </div>`,
        
        'arrow-right': () => `<div class="pattern-element">
            <div style="margin: auto; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 15px solid black;"></div>
        </div>`,
        
        // Complex patterns for higher sets - size constrained
        'pattern-1': () => `<div class="pattern-element">
            <div style="width: 35px; height: 35px; margin: auto; background: repeating-linear-gradient(45deg, black 0, black 2px, white 2px, white 4px);"></div>
        </div>`,
        
        'pattern-2': () => `<div class="pattern-element">
            <div style="width: 35px; height: 35px; margin: auto; background: repeating-linear-gradient(0deg, black 0, black 3px, white 3px, white 6px);"></div>
        </div>`,
        
        'pattern-3': () => `<div class="pattern-element">
            <div style="width: 35px; height: 35px; margin: auto; background: radial-gradient(circle at center, black 30%, white 30%, white 35%, black 35%, black 40%, white 40%);"></div>
        </div>`,
        
        // Default fallback
        'missing': () => `<div class="pattern-element"></div>`,
        
        // Generate unique patterns for different positions and sets
        generateUniquePattern: (setLetter, questionNumber, position) => {
            const patterns = [
                // Different dot arrangements - constrained to fit
                () => {
                    const dotCount = Math.min(1 + (position % 5), 6); // Max 6 dots
                    const cols = Math.min(2 + (position % 2), 3); // Max 3 columns
                    return `<div class="pattern-element">
                        <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 2px; width: fit-content; margin: auto; max-width: 60px;">
                            ${Array.from({length: dotCount}, (_, i) => 
                                `<div style="width: 6px; height: 6px; background: black; border-radius: 50%;"></div>`
                            ).join('')}
                        </div>
                    </div>`;
                },
                
                // Different geometric shapes - size constrained
                () => {
                    const shapes = ['circle', 'square', 'triangle'];
                    const colors = ['black', '#666', '#333'];
                    const shape = shapes[position % shapes.length];
                    const color = colors[questionNumber % colors.length];
                    const size = Math.min(15 + (position % 4) * 3, 30); // Max 30px
                    
                    if (shape === 'circle') {
                        return `<div class="pattern-element">
                            <div style="width: ${size}px; height: ${size}px; background: ${color}; border-radius: 50%; margin: auto;"></div>
                        </div>`;
                    } else if (shape === 'square') {
                        return `<div class="pattern-element">
                            <div style="width: ${size}px; height: ${size}px; background: ${color}; margin: auto;"></div>
                        </div>`;
                    } else {
                        const triangleSize = Math.min(size / 2, 15);
                        return `<div class="pattern-element">
                            <div style="width: 0; height: 0; border-left: ${triangleSize}px solid transparent; border-right: ${triangleSize}px solid transparent; border-bottom: ${triangleSize * 1.5}px solid ${color}; margin: auto;"></div>
                        </div>`;
                    }
                },
                
                // Line patterns - constrained to container
                () => {
                    const directions = ['horizontal', 'vertical', 'diagonal'];
                    const direction = directions[position % directions.length];
                    const maxSize = 40; // Maximum line length
                    
                    if (direction === 'horizontal') {
                        return `<div class="pattern-element">
                            <div style="width: ${Math.min(25 + (questionNumber % 4) * 3, maxSize)}px; height: 2px; background: black; margin: auto;"></div>
                        </div>`;
                    } else if (direction === 'vertical') {
                        return `<div class="pattern-element">
                            <div style="width: 2px; height: ${Math.min(25 + (questionNumber % 4) * 3, maxSize)}px; background: black; margin: auto;"></div>
                        </div>`;
                    } else {
                        return `<div class="pattern-element">
                            <div style="width: 35px; height: 35px; position: relative; margin: auto;">
                                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(${45 + position * 30}deg, transparent 48%, black 48%, black 52%, transparent 52%);"></div>
                            </div>
                        </div>`;
                    }
                },
                
                // Grid patterns - well contained
                () => {
                    const gridSize = 2 + (position % 2); // 2x2 or 3x3
                    const fillPattern = position % 3; // Different fill types
                    
                    if (fillPattern === 0) {
                        // Checkerboard
                        return `<div class="pattern-element">
                            <div style="width: 30px; height: 30px; margin: auto; background: repeating-conic-gradient(from 0deg, black 0deg 90deg, white 90deg 180deg); background-size: 10px 10px;"></div>
                        </div>`;
                    } else if (fillPattern === 1) {
                        // Stripes
                        return `<div class="pattern-element">
                            <div style="width: 30px; height: 30px; margin: auto; background: repeating-linear-gradient(${position * 45}deg, black 0px 3px, white 3px 6px);"></div>
                        </div>`;
                    } else {
                        // Concentric shapes
                        return `<div class="pattern-element">
                            <div style="width: 30px; height: 30px; margin: auto; background: radial-gradient(circle, black 20%, white 20%, white 30%, black 30%, black 40%, white 40%);"></div>
                        </div>`;
                    }
                }
            ];
            
            return patterns[questionNumber % patterns.length]();
        }
    }
};