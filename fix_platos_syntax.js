const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const brokenBlock = `                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}`;

const fixedBlock = `                            ))}
                          </div>
                        ) : (
                          <div className="p-10 text-center text-slate-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-100">
                            <span className="text-3xl mb-2 block">🍽</span>
                            <p className="text-sm font-medium">No hay platos en esta categoría.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}`;

// We'll search for lines 1746-1753 and replace them.
// Note: Using trim() and lines to avoid hidden whitespace issues.
const startIdx = content.indexOf('                          ))}');
const endIdx = content.indexOf('            })}', startIdx) + 15; // length of '            })}'

if (startIdx !== -1 && endIdx !== -1) {
    const newContent = content.slice(0, startIdx) + fixedBlock + content.slice(endIdx);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed syntax error and restored ternary in MenuPlatosBlock.');
} else {
    console.error('Broken block not found. Trying alternative search.');
}
