/**
 * Raft Consensus Algorithm — Interactive Demo
 * Uses TechDiagrams framework for step-through animation.
 * Embedded in distributed-systems-k8s-part02-consensus.html
 */
(function() {
    'use strict';

    // ─── Element Definitions ────────────────────────────────────────────────
    var NODES = [
        { id: 'A', type: 'circle', x: 300, y: 70, label: 'A', sublabel: 'Follower' },
        { id: 'B', type: 'circle', x: 470, y: 195, label: 'B', sublabel: 'Follower' },
        { id: 'C', type: 'circle', x: 405, y: 385, label: 'C', sublabel: 'Follower' },
        { id: 'D', type: 'circle', x: 195, y: 385, label: 'D', sublabel: 'Follower' },
        { id: 'E', type: 'circle', x: 130, y: 195, label: 'E', sublabel: 'Follower' },
    ];

    // Generate edges between all node pairs
    var EDGES = [];
    for (var i = 0; i < NODES.length; i++) {
        for (var j = i + 1; j < NODES.length; j++) {
            EDGES.push({
                id: 'link-' + NODES[i].id + '-' + NODES[j].id,
                type: 'line',
                x1: NODES[i].x, y1: NODES[i].y,
                x2: NODES[j].x, y2: NODES[j].y
            });
        }
    }

    // Badges (term indicators above each node)
    var BADGES = NODES.map(function(n) {
        return { id: 'badge-' + n.id, type: 'badge', x: n.x, y: n.y - 46, text: 'T0' };
    });

    // Quorum value bar
    var QUORUM_BAR = {
        id: 'quorum', type: 'value', x: 240, y: 442,
        width: 120, height: 12, total: 5, threshold: 3,
        label: '', showLabel: true
    };

    // Log entries (rendered per-node, positioned dynamically)
    var LOG_ELEMENTS = NODES.map(function(n) {
        return {
            id: 'log-' + n.id, type: 'badge',
            x: n.x + (n.x > 300 ? 48 : -48),
            y: n.y,
            width: 54, height: 16, text: ''
        };
    });

    var ALL_ELEMENTS = EDGES.concat(NODES).concat(BADGES).concat(LOG_ELEMENTS).concat([QUORUM_BAR]);

    // ─── Theme (site colors mapped to Raft roles) ───────────────────────────
    var THEME = {
        follower: '#5a6e82',
        candidate: '#c4873b',
        leader: '#3B9797',
        vote: '#c4873b',
        ack: '#3B9797',
        logEntry: '#16476A',
        logCommit: '#3B9797'
    };

    // ─── Helper: build snapshot for all nodes ───────────────────────────────
    function snap(nodeStates, opts) {
        var s = {};
        var roles = { follower: THEME.follower, candidate: THEME.candidate, leader: THEME.leader };

        ['A', 'B', 'C', 'D', 'E'].forEach(function(id) {
            var ns = (nodeStates && nodeStates[id]) || {};
            var role = ns.role || 'follower';
            var term = ns.term || 0;
            var color = roles[role];

            s[id] = { fill: color, sublabel: role.charAt(0).toUpperCase() + role.slice(1), ringOpacity: role === 'leader' ? 0.7 : 0.35 };
            // Hide term badge when T0 (no meaningful info)
            s['badge-' + id] = { text: term > 0 ? 'T' + term : '', opacity: term > 0 ? 1 : 0 };

            // Log entry — hide badge when empty
            if (ns.log) {
                s['log-' + id] = { text: ns.log.idx + '|T' + ns.log.term + '|' + ns.log.cmd, fill: ns.log.committed ? THEME.logCommit : THEME.logEntry, opacity: 1 };
            } else {
                s['log-' + id] = { text: '', opacity: 0 };
            }
        });

        // Quorum bar
        if (opts && opts.votes != null) {
            s.quorum = { value: opts.votes, label: 'Votes: ' + opts.votes + '/5 (quorum: 3)', valueFill: opts.votes >= 3 ? 'leader' : 'candidate' };
        } else {
            s.quorum = { value: 0, label: '' };
        }

        // Partitioned links
        if (opts && opts.partitioned) {
            var main = ['A', 'B', 'C'];
            var minor = ['D', 'E'];
            minor.forEach(function(p) {
                main.forEach(function(m) {
                    var ids = [p, m].sort();
                    s['link-' + ids[0] + '-' + ids[1]] = { stroke: '#BF092F', opacity: 0.2, dash: '2 6' };
                });
            });
        }

        return s;
    }

    var LOG = { idx: 1, term: 1, cmd: 'x=5', committed: false };
    var LOG_COMMITTED = { idx: 1, term: 1, cmd: 'x=5', committed: true };

    // ─── Scenes ─────────────────────────────────────────────────────────────
    var scenes = [
        {
            title: 'All Nodes Start as Followers',
            desc: 'A fresh Raft cluster begins with every node in the <strong>Follower</strong> state at term 0. No leader exists yet. Each follower starts a randomized election timeout (150–300 ms). The first node whose timer expires initiates an election.',
            time: 't = 0 ms',
            snapshot: snap()
        },
        {
            title: 'Election Timeout Fires on Node C',
            desc: 'Node C\'s randomized timeout (<strong>180 ms</strong>) expires first — no heartbeat was received. Node C transitions to <strong>Candidate</strong>, increments its term to 1, and votes for itself.',
            time: 't = 180 ms',
            snapshot: snap({ C: { role: 'candidate', term: 1 } }, { votes: 1 }),
            play: async function(ctx) {
                await ctx.timeoutRing('C', 1.0);
                await ctx.stateChange('C', 'candidate', { sublabel: 'Candidate' });
                await ctx.label('badge-C', 'T1');
            }
        },
        {
            title: 'Candidate Requests Votes',
            desc: 'Node C sends <code>RequestVote(term=1, lastLogIndex=0)</code> RPCs to A, B, D, and E. Each node will grant its vote if it hasn\'t already voted in term 1 and the candidate\'s log is at least as up-to-date.',
            time: 't = 185 ms',
            snapshot: snap({ C: { role: 'candidate', term: 1 } }, { votes: 1 }),
            play: async function(ctx) {
                await ctx.stateChange('C', 'candidate', { sublabel: 'Candidate' });
                await ctx.broadcast('C', ['A', 'B', 'D', 'E'], 'vote', 0.08);
            }
        },
        {
            title: 'Votes Granted — Majority Reached',
            desc: 'All 4 nodes grant their vote. Node C now has <strong>5 votes — quorum is 3</strong>. Majority achieved after a single round-trip.',
            time: 't = 195 ms',
            snapshot: snap({ A: { term: 1 }, B: { term: 1 }, D: { term: 1 }, E: { term: 1 }, C: { role: 'candidate', term: 1 } }, { votes: 5 }),
            play: async function(ctx) {
                await ctx.timeline([
                    { parallel: [
                        function() { return ctx.path('A', 'C', 'ack'); },
                        function() { return ctx.path('B', 'C', 'ack'); },
                        function() { return ctx.path('D', 'C', 'ack'); },
                        function() { return ctx.path('E', 'C', 'ack'); }
                    ]},
                    { do: function() { return ctx.value('quorum', 5, 5, { label: 'Votes: 5/5 (quorum: 3)', fill: 'leader' }); } }
                ]);
            }
        },
        {
            title: 'Node C Becomes Leader',
            desc: 'With a majority, Node C transitions to <strong>Leader</strong> for term 1. It immediately sends initial empty heartbeats to establish authority.',
            time: 't = 200 ms',
            snapshot: snap({ A: { term: 1 }, B: { term: 1 }, D: { term: 1 }, E: { term: 1 }, C: { role: 'leader', term: 1 } }, { votes: 5 }),
            play: async function(ctx) {
                await ctx.stateChange('C', 'leader', { sublabel: 'Leader' });
                await ctx.pulse('C');
            }
        },
        {
            title: 'Leader Sends Heartbeats',
            desc: 'The leader sends periodic <code>AppendEntries(entries=[])</code> heartbeats every 100 ms. Each heartbeat resets followers\' election timers, preventing unnecessary elections.',
            time: 't = 300 ms',
            snapshot: snap({ A: { term: 1 }, B: { term: 1 }, D: { term: 1 }, E: { term: 1 }, C: { role: 'leader', term: 1 } }),
            play: async function(ctx) {
                await ctx.broadcast('C', ['A', 'B', 'D', 'E'], 'ack', 0.04);
                await new Promise(function(r) { setTimeout(r, 350); });
                await ctx.broadcast('C', ['A', 'B', 'D', 'E'], 'ack', 0.04);
            }
        },
        {
            title: 'Client Write — Log Appended',
            desc: 'A client sends <code>set x = 5</code>. The leader appends it as log entry <strong>(index 1, term 1, x=5)</strong>. The entry is <em>not yet committed</em> — replicated ≠ committed.',
            time: 't = 450 ms',
            snapshot: snap({ A: { term: 1 }, B: { term: 1 }, D: { term: 1 }, E: { term: 1 }, C: { role: 'leader', term: 1, log: LOG } }),
            play: async function(ctx) {
                await ctx.path('A', 'C', '#fff', 0.45);
                await ctx.label('log-C', '1|T1|x=5');
            }
        },
        {
            title: 'Leader Replicates Log Entry',
            desc: 'The leader sends <code>AppendEntries(entries=[{1,1,x=5}])</code> to all followers. Each appends to their log and sends ACK.',
            time: 't = 460 ms',
            snapshot: snap({ A: { term: 1, log: LOG }, B: { term: 1, log: LOG }, D: { term: 1, log: LOG }, E: { term: 1, log: LOG }, C: { role: 'leader', term: 1, log: LOG } }),
            play: async function(ctx) {
                await ctx.broadcast('C', ['A', 'B', 'D', 'E'], 'logEntry', 0.06);
                await ctx.timeline([
                    { parallel: [
                        function() { return ctx.label('log-A', '1|T1|x=5'); },
                        function() { return ctx.label('log-B', '1|T1|x=5'); },
                        function() { return ctx.label('log-D', '1|T1|x=5'); },
                        function() { return ctx.label('log-E', '1|T1|x=5'); }
                    ]}
                ]);
            }
        },
        {
            title: 'Majority ACK — Entry Committed',
            desc: 'Leader receives ACKs from A, B, D, E. Since self + any 2 = majority, it advances <code>commitIndex</code> to 1. The entry turns <strong style="color:#3B9797">teal</strong> — safely committed. State machines apply <code>x = 5</code>.',
            time: 't = 475 ms',
            snapshot: snap({ A: { term: 1, log: LOG_COMMITTED }, B: { term: 1, log: LOG_COMMITTED }, D: { term: 1, log: LOG_COMMITTED }, E: { term: 1, log: LOG_COMMITTED }, C: { role: 'leader', term: 1, log: LOG_COMMITTED } }),
            play: async function(ctx) {
                await ctx.timeline([
                    { parallel: ['A', 'B', 'D', 'E'].map(function(id) {
                        return function() {
                            var el = document.querySelector('#td-badge-text-log-' + id);
                            if (el) el.parentElement.querySelector('rect').setAttribute('fill', THEME.logCommit);
                            return Promise.resolve();
                        };
                    })},
                    { do: function() {
                        var el = document.querySelector('#td-badge-text-log-C');
                        if (el) el.parentElement.querySelector('rect').setAttribute('fill', THEME.logCommit);
                        return Promise.resolve();
                    }, delay: 200 }
                ]);
            }
        },
        {
            title: 'Network Partition',
            desc: 'A network failure isolates <strong>D and E</strong> from A, B, C. The leader (C) still reaches A and B — 3 nodes = majority. The main partition <strong>continues operating normally</strong>. The minority is cut off.',
            time: 't = 2000 ms',
            snapshot: snap({ A: { term: 1, log: LOG_COMMITTED }, B: { term: 1, log: LOG_COMMITTED }, C: { role: 'leader', term: 1, log: LOG_COMMITTED }, D: { term: 1, log: LOG_COMMITTED }, E: { term: 1, log: LOG_COMMITTED } }, { partitioned: true }),
            play: async function(ctx) {
                await ctx.linkState(['link-A-D', 'link-A-E', 'link-B-D', 'link-B-E', 'link-C-D', 'link-C-E'], 'broken');
            }
        },
        {
            title: 'Minority Election — Cannot Reach Quorum',
            desc: 'D\'s election timeout fires. It becomes candidate for <strong>term 2</strong>, gets E\'s vote (2 votes). But <strong>2 < 3 (quorum)</strong> — election fails. The minority partition cannot make progress.',
            time: 't = 2300 ms',
            snapshot: snap({ A: { term: 1, log: LOG_COMMITTED }, B: { term: 1, log: LOG_COMMITTED }, C: { role: 'leader', term: 1, log: LOG_COMMITTED }, D: { role: 'candidate', term: 2, log: LOG_COMMITTED }, E: { term: 2, log: LOG_COMMITTED } }, { partitioned: true, votes: 2 }),
            play: async function(ctx) {
                await ctx.timeoutRing('D', 0.8);
                await ctx.stateChange('D', 'candidate', { sublabel: 'Candidate' });
                await ctx.label('badge-D', 'T2');
                await ctx.path('D', 'E', 'vote');
                await ctx.path('E', 'D', 'ack');
                await ctx.value('quorum', 2, 5, { label: 'Votes: 2/5 (quorum: 3)', fill: 'candidate' });
            }
        },
        {
            title: 'Partition Heals — Term Discovery',
            desc: 'Connectivity restores. D (term 2) contacts C (term 1). C receives a message with a <strong>higher term</strong> and <em>steps down</em> to follower — this is a Raft safety property. All nodes update to term 2.',
            time: 't = 5000 ms',
            snapshot: snap({ A: { term: 2, log: LOG_COMMITTED }, B: { term: 2, log: LOG_COMMITTED }, C: { term: 2, log: LOG_COMMITTED }, D: { term: 2, log: LOG_COMMITTED }, E: { term: 2, log: LOG_COMMITTED } }),
            play: async function(ctx) {
                await ctx.linkState(['link-A-D', 'link-A-E', 'link-B-D', 'link-B-E', 'link-C-D', 'link-C-E'], 'normal');
                await ctx.stateChange('C', 'follower', { sublabel: 'Follower' });
                await ctx.timeline([
                    { parallel: ['A', 'B', 'C', 'D', 'E'].map(function(id) {
                        return function() { return ctx.label('badge-' + id, 'T2'); };
                    })}
                ]);
            }
        },
        {
            title: 'New Election — Term 2',
            desc: 'With no leader in term 2, election timeouts fire. Node B\'s timer expires first (<strong>165 ms</strong>). It becomes candidate, gathers majority votes, and becomes <strong>Leader for term 2</strong>.',
            time: 't = 5165 ms',
            snapshot: snap({ A: { term: 2, log: LOG_COMMITTED }, B: { role: 'leader', term: 2, log: LOG_COMMITTED }, C: { term: 2, log: LOG_COMMITTED }, D: { term: 2, log: LOG_COMMITTED }, E: { term: 2, log: LOG_COMMITTED } }, { votes: 5 }),
            play: async function(ctx) {
                await ctx.timeoutRing('B', 0.8);
                await ctx.stateChange('B', 'candidate', { sublabel: 'Candidate' });
                await ctx.broadcast('B', ['A', 'C', 'D', 'E'], 'vote', 0.06);
                await new Promise(function(r) { setTimeout(r, 200); });
                await ctx.stateChange('B', 'leader', { sublabel: 'Leader' });
                await ctx.pulse('B');
            }
        },
        {
            title: 'Cluster Fully Converged',
            desc: 'All 5 nodes follow Leader B in term 2. Logs are identical — committed entry <code>(1, 1, x=5)</code> is safely replicated everywhere. <strong>Consensus achieved</strong> — the cluster survived a partition with correct term reconciliation and no split-brain.',
            time: 't = 5200 ms',
            snapshot: snap({ A: { term: 2, log: LOG_COMMITTED }, B: { role: 'leader', term: 2, log: LOG_COMMITTED }, C: { term: 2, log: LOG_COMMITTED }, D: { term: 2, log: LOG_COMMITTED }, E: { term: 2, log: LOG_COMMITTED } }),
            play: async function(ctx) {
                await ctx.broadcast('B', ['A', 'C', 'D', 'E'], 'ack', 0.04);
            }
        }
    ];

    // ─── Init ───────────────────────────────────────────────────────────────
    function init() {
        TechDiagrams.createDemo({
            container: '#raftDemo',
            elements: ALL_ELEMENTS,
            scenes: scenes,
            theme: THEME,
            viewBox: '0 0 600 460'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
