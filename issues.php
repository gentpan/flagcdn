<?php
$pageTitle = 'Feedback & Issues – Report Bugs, Request Flags | flagcdn.io';
$pageDescription = 'Submit feedback, report flag errors, request new flags, or suggest improvements for flagcdn.io.';
$pageKeywords = 'feedback, issues, bug report, flag correction, flagcdn feedback';
$canonicalUrl = 'https://flagcdn.io/issues/';
$baseHref = '/';
$extraHead = '<style>
    :root {
      --iss-accent: var(--bs-primary, #1971c2);
      --iss-muted: var(--bs-tertiary-color, #6c757d);
      --iss-line: var(--bs-border-color, #e9ecef);
      --iss-surface: var(--bs-surface, #fff);
      --iss-input-bg: var(--bs-input-bg, #fff);
      --iss-tag-fix: #d63384;
      --iss-tag-fix-bg: rgba(214, 51, 132, 0.08);
      --iss-tag-new: #0d6efd;
      --iss-tag-new-bg: rgba(13, 110, 253, 0.08);
      --iss-tag-suggestion: #198754;
      --iss-tag-suggestion-bg: rgba(25, 135, 84, 0.08);
      --iss-tag-bug: #dc3545;
      --iss-tag-bug-bg: rgba(220, 53, 69, 0.08);
      --iss-tag-other: #6f42c1;
      --iss-tag-other-bg: rgba(111, 66, 193, 0.08);
    }

    .issues-page { padding-bottom: 2rem; font-family: "Outfit", "PingFang SC", "Microsoft YaHei", sans-serif; line-height: 1.5; }

    /* ---- form ---- */
    .iss-form-card {
      background: var(--iss-surface);
      border: 1px solid var(--iss-line);
      border-radius: 4px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .iss-form-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 1rem;
      color: var(--bs-emphasis-color, #212529);
    }
    .iss-form-row {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .iss-form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .iss-form-group--full { width: 100%; }
    .iss-form-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--iss-muted);
      margin-bottom: 0.25rem;
    }
    .iss-form-label em { font-style: normal; color: #dc3545; }
    .iss-form-input,
    .iss-form-select,
    .iss-form-textarea {
      padding: 0.5rem 0.65rem;
      border: 1px solid var(--iss-line);
      border-radius: 4px;
      background: var(--iss-input-bg);
      color: var(--bs-body-color, #212529);
      font-size: 0.9rem;
      font-family: inherit;
      transition: border-color 0.15s;
    }
    .iss-form-input:focus,
    .iss-form-select:focus,
    .iss-form-textarea:focus {
      outline: none;
      border-color: var(--iss-accent);
      box-shadow: 0 0 0 2px rgba(25, 113, 194, 0.12);
    }
    .iss-form-textarea {
      resize: vertical;
      min-height: 100px;
    }
    .iss-form-hint {
      font-size: 0.75rem;
      color: var(--iss-muted);
      margin-top: 0.2rem;
    }
    .iss-form-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .iss-btn-submit {
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      background: var(--iss-accent);
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .iss-btn-submit:hover { background: var(--bs-primary-hover, #145a9b); }
    .iss-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .iss-form-msg {
      font-size: 0.85rem;
      display: none;
    }
    .iss-form-msg--ok { color: #198754; }
    .iss-form-msg--err { color: #dc3545; }

    /* ---- issues list ---- */
    .iss-list-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem;
      color: var(--bs-emphasis-color, #212529);
    }
    .iss-list { list-style: none; margin: 0; padding: 0; }
    .iss-item {
      border: 1px solid var(--iss-line);
      border-radius: 4px;
      padding: 0.85rem 1rem;
      margin-bottom: 0.5rem;
      background: var(--iss-surface);
      transition: box-shadow 0.15s;
    }
    .iss-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .iss-item-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.35rem;
    }
    .iss-tag {
      display: inline-block;
      padding: 0.08rem 0.45rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .iss-tag--flag-fix { color: var(--iss-tag-fix); background: var(--iss-tag-fix-bg); }
    .iss-tag--new-flag { color: var(--iss-tag-new); background: var(--iss-tag-new-bg); }
    .iss-tag--suggestion { color: var(--iss-tag-suggestion); background: var(--iss-tag-suggestion-bg); }
    .iss-tag--bug { color: var(--iss-tag-bug); background: var(--iss-tag-bug-bg); }
    .iss-tag--other { color: var(--iss-tag-other); background: var(--iss-tag-other-bg); }
    .iss-item-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--bs-body-color, #212529);
    }
    .iss-item-body {
      font-size: 0.88rem;
      color: var(--bs-secondary-color, #495057);
      margin-bottom: 0.35rem;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .iss-item-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: var(--iss-muted);
    }
    .iss-item-meta a {
      color: var(--iss-accent);
      text-decoration: none;
    }
    .iss-item-meta a:hover { text-decoration: underline; }
    .iss-empty {
      text-align: center;
      padding: 2rem;
      color: var(--iss-muted);
      font-size: 0.9rem;
    }
    .iss-status {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #198754;
      flex-shrink: 0;
    }
    .iss-status--closed { background: #6c757d; }

    @media (max-width: 600px) {
      .iss-form-row { flex-direction: column; gap: 0.5rem; }
    }
  </style>';
$bodyAttr = 'data-i18n-page-title="issues.titleFull"';
require __DIR__ . '/header.php';
?>
  <section class="welcome welcome--compact">
    <div class="container">
      <h1 class="welcome-title welcome-title--compact" data-i18n="issues.title">Feedback</h1>
      <p class="welcome-desc" data-i18n="issues.heroSub">Report flag errors, request new flags, or suggest improvements</p>
    </div>
  </section>

  <main class="container issues-page">

    <!-- submit form -->
    <div class="iss-form-card">
      <h2 class="iss-form-title" data-i18n="issues.formTitle"><i class="fa-regular fa-pen-to-square" style="margin-right:0.35rem" aria-hidden="true"></i>Submit Feedback</h2>
      <form id="issue-form" autocomplete="off">
        <div class="iss-form-row">
          <div class="iss-form-group">
            <label class="iss-form-label" for="iss-name"><em>*</em> <span data-i18n="issues.labelName">Name</span></label>
            <input class="iss-form-input" type="text" id="iss-name" name="name" required maxlength="60">
          </div>
          <div class="iss-form-group">
            <label class="iss-form-label" for="iss-email"><span data-i18n="issues.labelEmail">Email</span></label>
            <input class="iss-form-input" type="email" id="iss-email" name="email" maxlength="120" data-i18n-placeholder="issues.emailHint" placeholder="Won't be displayed publicly">
          </div>
          <div class="iss-form-group">
            <label class="iss-form-label" for="iss-website"><span data-i18n="issues.labelWebsite">Website</span></label>
            <input class="iss-form-input" type="url" id="iss-website" name="website" maxlength="200" placeholder="https://">
          </div>
        </div>
        <div class="iss-form-row">
          <div class="iss-form-group">
            <label class="iss-form-label" for="iss-type"><em>*</em> <span data-i18n="issues.labelType">Type</span></label>
            <select class="iss-form-select" id="iss-type" name="type" required>
              <option value="flag-fix" data-i18n="issues.typeFlagFix">Flag Correction</option>
              <option value="new-flag" data-i18n="issues.typeNewFlag">New Flag Request</option>
              <option value="suggestion" data-i18n="issues.typeSuggestion">Suggestion</option>
              <option value="bug" data-i18n="issues.typeBug">Bug Report</option>
              <option value="other" data-i18n="issues.typeOther">Other</option>
            </select>
          </div>
          <div class="iss-form-group" style="flex:3">
            <label class="iss-form-label" for="iss-title"><em>*</em> <span data-i18n="issues.labelTitle">Title</span></label>
            <input class="iss-form-input" type="text" id="iss-title" name="title" required maxlength="120" data-i18n-placeholder="issues.titleHint" placeholder="Brief summary of the issue">
          </div>
        </div>
        <div class="iss-form-group iss-form-group--full">
          <label class="iss-form-label" for="iss-body"><em>*</em> <span data-i18n="issues.labelBody">Description</span></label>
          <textarea class="iss-form-textarea" id="iss-body" name="body" required maxlength="2000" rows="5" data-i18n-placeholder="issues.bodyHint" placeholder="Describe the issue in detail. You can include URLs."></textarea>
          <span class="iss-form-hint" data-i18n="issues.bodyMax">Max 2000 characters. URLs will be auto-linked.</span>
        </div>
        <div class="iss-form-actions">
          <button type="submit" class="iss-btn-submit" id="iss-submit" data-i18n="issues.btnSubmit">Submit</button>
          <span class="iss-form-msg" id="iss-form-msg"></span>
        </div>
      </form>
    </div>

    <!-- issues list -->
    <h2 class="iss-list-title"><i class="fa-regular fa-comments" style="margin-right:0.35rem" aria-hidden="true"></i><span data-i18n="issues.listTitle">All Feedback</span> <span id="iss-count" style="font-weight:400;font-size:0.85rem;color:var(--iss-muted)"></span></h2>
    <ul class="iss-list" id="iss-list">
      <li class="iss-empty" id="iss-loading" data-i18n="issues.loading">Loading...</li>
    </ul>

  </main>

<?php
$footerClass = 'docs-footer';
$showFooterNav = true;
ob_start();
?>
  <script src="/assets/i18n.js"></script>
  <script>
    (function () {
      var TYPE_LABELS = {
        'flag-fix': 'Flag Fix', 'new-flag': 'New Flag',
        'suggestion': 'Suggestion', 'bug': 'Bug', 'other': 'Other'
      };

      function escHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
      }

      function linkify(text) {
        return escHtml(text).replace(
          /(https?:\/\/[^\s<]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
      }

      function timeAgo(iso) {
        var d = new Date(iso);
        var now = new Date();
        var sec = Math.floor((now - d) / 1000);
        if (sec < 60) return 'just now';
        if (sec < 3600) return Math.floor(sec / 60) + 'm ago';
        if (sec < 86400) return Math.floor(sec / 3600) + 'h ago';
        if (sec < 2592000) return Math.floor(sec / 86400) + 'd ago';
        return d.toISOString().slice(0, 10);
      }

      function renderIssue(iss) {
        var tagClass = 'iss-tag--' + iss.type;
        var label = TYPE_LABELS[iss.type] || iss.type;
        var namePart = iss.website
          ? '<a href="' + escHtml(iss.website) + '" target="_blank" rel="noopener noreferrer">' + escHtml(iss.name) + '</a>'
          : escHtml(iss.name);
        return '<li class="iss-item">'
          + '<div class="iss-item-header">'
          + '<span class="iss-status' + (iss.status === 'closed' ? ' iss-status--closed' : '') + '"></span>'
          + '<span class="iss-tag ' + tagClass + '">' + label + '</span>'
          + '<span class="iss-item-title">' + escHtml(iss.title) + '</span>'
          + '</div>'
          + '<div class="iss-item-body">' + linkify(iss.body) + '</div>'
          + '<div class="iss-item-meta">'
          + '<span>' + namePart + '</span>'
          + '<span>' + timeAgo(iss.created_at) + '</span>'
          + '<span>#' + iss.id + '</span>'
          + '</div>'
          + '</li>';
      }

      // load list
      function loadIssues() {
        fetch('/api/issues.php')
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var list = document.getElementById('iss-list');
            var count = document.getElementById('iss-count');
            var items = data.issues || [];
            count.textContent = '(' + items.length + ')';
            if (items.length === 0) {
              list.innerHTML = '<li class="iss-empty" data-i18n="issues.empty">No feedback yet. Be the first!</li>';
              if (window.I18n) I18n.apply();
              return;
            }
            list.innerHTML = items.map(renderIssue).join('');
          })
          .catch(function () {
            document.getElementById('iss-list').innerHTML = '<li class="iss-empty">Failed to load.</li>';
          });
      }

      loadIssues();

      // submit
      var form = document.getElementById('issue-form');
      var btn = document.getElementById('iss-submit');
      var msg = document.getElementById('iss-form-msg');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        btn.disabled = true;
        msg.style.display = 'none';

        var payload = {
          name: document.getElementById('iss-name').value.trim(),
          email: document.getElementById('iss-email').value.trim(),
          website: document.getElementById('iss-website').value.trim(),
          type: document.getElementById('iss-type').value,
          title: document.getElementById('iss-title').value.trim(),
          body: document.getElementById('iss-body').value.trim()
        };

        fetch('/api/issues.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          btn.disabled = false;
          if (!res.ok || !res.data.ok) {
            msg.textContent = res.data.error || 'Submission failed';
            msg.className = 'iss-form-msg iss-form-msg--err';
            msg.style.display = 'inline';
            return;
          }
          msg.textContent = 'Submitted successfully!';
          msg.className = 'iss-form-msg iss-form-msg--ok';
          msg.style.display = 'inline';
          form.reset();
          loadIssues();
          setTimeout(function () { msg.style.display = 'none'; }, 4000);
        })
        .catch(function () {
          btn.disabled = false;
          msg.textContent = 'Network error';
          msg.className = 'iss-form-msg iss-form-msg--err';
          msg.style.display = 'inline';
        });
      });

    })();
  </script>
<?php
$footerScripts = ob_get_clean();
require __DIR__ . '/footer.php';
?>
