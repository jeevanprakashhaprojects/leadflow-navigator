# Leadflow Navigator

Let me examine your current Add Lead implementation in detail before designing the improvements.

Now I have a complete picture of your current Add Lead screen. Here's the full detailed design.

---

# Add Lead — Full UI/UX Design Document

## Current State Analysis

Your current form is a **single 1610-line layout** with **6 section cards** containing roughly **80+ fields** all visible at once in a scroll view. The Kotlin file is 3618 lines with manual wiring for every picker.

**What's good:**
- Section headers with icons, subtitles, numbered steps
- Collapsible demographics section (toggle)
- Empty-state cards for Interests and Relations with dashed borders
- Auto-save draft, keyboard handling, validation with error states
- "Same as Mobile" WhatsApp quick-copy
- Country code picker with flag emojis
- Conditional fields (Lost Reason shows only when status = Closed Lost)

**What needs improvement:**
- 80+ fields in one scroll = overwhelming for agents
- No visual hierarchy between "required" and "optional" fields beyond `*`
- Same-looking input rows for everything — no differentiation between text, selector, date, and toggle fields
- No progress indicator — user has no idea how long the form is
- No smart grouping or step flow — everything is visible at once
- EditMode/ViewMode not separated — editing an existing lead looks identical to creating new
- No field-level quick actions (copy address, lookup PIN, etc.)
- No smart suggestions or autocomplete
- The 3618-line fragment is doing too much — picker logic, validation, auto-save, Firebase writes all in one class

---

## Recommended Architecture: Stepper Wizard

Instead of one giant scroll, break the form into **logical steps** with a stepper indicator at the top. This reduces cognitive load and gives users a clear sense of progress.

### Step Breakdown

```
Step 1: Contact Info  (7 fields, ~2 min)
Step 2: Company & Role (10 fields, ~2 min)
Step 3: Lead Pipeline  (12 fields, ~3 min)
Step 4: Address  (7 fields, ~1 min)
Step 5: Social & Notes  (5 fields, ~1 min)
Step 6: Relations & Interests (dynamic, ~2 min)
Review & Save
```

**Total**: ~6 steps, with optional sections collapsed into the last step.

### Stepper UI Component

```xml
<!-- Top of the form, replaces the toolbar subtitle -->
<com.google.android.material.progressindicator.LinearProgressIndicator
 android:id="@+id/progressStepper"
 android:layout_width="match_parent"
 android:layout_height="4dp"
 app:indicatorColor="#2E5BFF"
 app:trackColor="#E5E7EB"
 app:trackThickness="4dp" />

<HorizontalScrollView
 android:layout_width="match_parent"
 android:layout_height="wrap_content"
 android:scrollbars="none">

 <LinearLayout
 android:id="@+id/stepperContainer"
 android:layout_width="wrap_content"
 android:layout_height="wrap_content"
 android:orientation="horizontal">

 <!-- Repeated for each step -->
 <include
 layout="@layout/item_stepper_step"
 android:layout_width="wrap_content"
 android:layout_height="wrap_content" />
  </LinearLayout>
</HorizontalScrollView>
```

```xml
<!-- item_stepper_step.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
 android:layout_width="wrap_content"
 android:layout_height="wrap_content"
 android:orientation="horizontal"
 android:gravity="center_vertical">

  <!-- Step circle: numbered 1-6, filled when active/done, outline when pending -->
 <TextView
 android:id="@+id/tvStepNumber"
 android:layout_width="28dp"
 android:layout_height="28dp"
 android:gravity="center"
 android:text="1"
 android:textColor="#FFFFFF"
 android:textSize="12sp"
 android:textStyle="bold"
 android:background="@drawable/bg_stepper_active" />

 <!-- Connector line between steps -->
 <View
 android:layout_width="24dp"
 android:layout_height="2dp"
 android:background="#E5E7EB" />

  <TextView
  android:id="@+id/tvStepLabel"
 android:layout_width="wrap_content"
 android:layout_height="wrap_content"
 android:layout_marginStart="8dp"
 android:text="Contact"
 android:textColor="#6F767E"
 android:textSize="12sp" />
</LinearLayout>
```

**States:**
- **Active step**: Blue filled circle `#2E5BFF`, blue text, connector line blue
- **Completed step**: Green filled circle with checkmark `#27AE60`, grey text
- **Pending step**: Grey outlined circle, grey text, grey connector

---

## Step 1: Contact Information (Redesigned)

### Current fields:
Salutation, First Name, Last Name, Mobile Phone, Alternate Phone, WhatsApp, Primary Email, Secondary Email, + expandable demographics (DOB, Age, Gender, Marital, Occupation, PAN, Aadhaar, Income, Children, DND, Marketing Consent, Preferred Contact, Best Time to Call, Language)

### New design — Card-based with smart grouping:

```
┌─────────────────────────────────────────┐
│ 👤 Contact Information  [▶] │
│  Name, phones & email channels  │
├─────────────────────────────────────────┤
│  │
│  ┌─ Primary Identity ──────────────┐  │
│  │ Salutation [Mr. ▾] │ │
│ │ First Name [___________] │  │
│  │ Last Name [___________] │  │
│  └────────────────────────────────┘ │
│ │
│  ┌─ Phone Numbers ────────────────┐ │
│ │  📱 Mobile  [+91 ▾] [_______]│ │
│ │  📱 Alternate [+91 ▾] [_______]│ │
│ │ 💬 WhatsApp [+91 ▾] [_______]│ │
│ │  [Same as Mobile ✓] │  │
│  └────────────────────────────────┘ │
│ │
│  ┌─ Email Addresses ──────────────┐ │
│ │  ✉️ Primary  [___________]  │ │
│ │  ✉️ Secondary [___________] │ │
│  └────────────────────────────────┘ │
│ │
│ ┌─ Personal Details ─────────────┐ │
│ │ 🎂 DOB [DD/MM/YYYY ▾] │ │
│ │  👤 Gender  [Select ▾]  │ │
│ │  💼 Occupation [___________]  │ │
│ │  💰 Income [₹ ▾]  │ │
│ │  👨‍👩‍👧 Children [0]  │ │
│ └────────────────────────────────┘ │
│ │
│ ┌─ Identifiers ─────────────────┐ │
│ │  PAN  [___________]  │ │
│ │  Aadhaar [___________]  │ │
│  └────────────────────────────────┘ │
│ │
│  ┌─ Communication Preferences ────┐  │
│  │  📞 Best Time  [Morning ▾]  │ │
│ │  🌐 Language [English ▾]  │ │
│ │  ✅ DND  [No ▾]  │ │
│ │ 📢 Marketing  [Yes ▾] │  │
│  └────────────────────────────────┘ │
│ │
└─────────────────────────────────────────┘
```

### Improvements:

1. **Sub-group cards inside the section** — Primary Identity, Phone Numbers, Email, Personal Details, Identifiers, Communication Preferences. Each has a tiny icon + label header.

2. **"Same as Mobile" toggle becomes a Material Switch** — cleaner than text button:
 ```xml
 <com.google.android.material.materialswitch.MaterialSwitch
 android:id="@+id/switchSameAsMobile"
  android:layout_width="wrap_content"
 android:layout_height="wrap_content"
 android:text="Same as Mobile"
 app:trackTint="@color/track_switch" />
 ```

3. **PIN-code auto-fill** — When pincode is entered, auto-suggest city/district/state using India Post API or a local lookup:
  ```kotlin
 // Simple India PIN lookup (6-digit → city, state)
 suspend fun lookupPincode(pincode: String): PincodeResult? {
 // Use local asset or API
 // Auto-fill city, district, state fields
 }
  ```

4. **Aadhaar/PAN formatting** — Auto-format as user types:
  ```kotlin
 val panWatcher = object : TextWatcher {
 override fun afterTextChanged(s: Editable?) {
 val pan = s.toString().uppercase()
  if (pan != s.toString()) { s?.replace(0, s.length, pan) }
  }
  }
 // Format: ABCDE1234F (5 letters, 4 digits, 1 letter)
 ```

5. **Smart demographics expand/collapse** — Instead of a text link at the bottom, use a collapsible section with smooth animation:
 ```xml
 <com.google.android.material.expandable.ExpandableWidget
 android:id="@+id/expandDemographics"
 ...>
  <!-- Content -->
 </com.google.android.material.expandable.ExpandableWidget>
 ```

---

## Step 2: Company & Role

### Current fields:
Company Name, Company Phone, Company Email, Company Address, Decision Maker Role, Decision Maker Level, Job Title, Department, Industry, Company Size, Annual Revenue, Website

### New design:

```
┌─────────────────────────────────────────┐
│ 🏢  Company & Role  [▶] │
│ Employer, designation & industry  │
├─────────────────────────────────────────┤
│  │
│  ┌─ Organization ──────────────────┐  │
│  │ Company  [___________]  │ │
│ │  Website [https://...] │ │
│ │ Phone  [+91 ▾] [_______] │  │
│  │ Email  [___________] │ │
│  └────────────────────────────────┘ │
│ │
│ ┌─ Your Role ─────────────────────┐ │
│ │  Designation [Select ▾]  │ │
│ │  Department  [Select ▾] │ │
│ │ Industry [Select ▾]  │ │
│ └────────────────────────────────┘ │
│ │
│ ┌─ Company Profile ───────────────┐ │
│ │ Size [11-50 ▾]  │ │
│ │  Revenue  [₹1Cr-10Cr ▾]  │ │
│ │  Address  [___________] │ │
│  └────────────────────────────────┘ │
│ │
│ ┌─ Decision Maker Info ───────────┐  │
│  │ Role  [Decision Maker ▾]  │ │
│ │  Level  [C-Level ▾]  │ │
│ └────────────────────────────────┘ │
│ │
└─────────────────────────────────────────┘
```

### Improvements:

1. **Industry selection with smart icons** — Each industry has a small icon:
 ```kotlin
  val industryIcons = mapOf(
  "Technology/IT" to R.drawable.ic_tech,
 "Banking & Finance" to R.drawable.ic_finance,
  "Healthcare & Pharma" to R.drawable.ic_health,
  ...
 )
 ```

2. **Company size with visual scale** — Instead of just "11-50", show a tiny bar indicator:
 ```
 Company Size: [█████░░░░░] 11-50 employees
 ```

3. **Revenue in INR with L/Cr suffix** — Format display as "₹1.5 Cr" instead of raw numbers.

---

## Step 3: Lead Pipeline & Opportunity

### Current fields:
Lead Status, Lost Reason, Lead Score, Customer Tier, VIP Flag, Referral Name, Referral Relationship, First Contact Date, Last Contact Date, UTM fields (5), Lead Source, Campaign Name, Lead Priority, Tags, Lead Owner, Expected Close Date, Expected Deal Value, Conversion Probability, Scheduled Action/Follow-up, + conditional fields (Follow-up type/date, Appointment date/time/address, Video call date/time, Callback date/time, Custom date/time)

### This is the most complex section — needs the most redesign.

```
┌─────────────────────────────────────────┐
│ 🎯  Lead Pipeline  [▶] │
│  Status, priority & deal tracking  │
├─────────────────────────────────────────┤
│  │
│  ┌─ Pipeline Status ───────────────┐ │
│ │ Status [New ▾] │ │
│ │ Priority [🔥 Priority 1 ▾]  │ │
│ │  Source [Select ▾]  │ │
│ │  Campaign [Summer Promo]  │ │
│  └────────────────────────────────┘ │
│ │
│ ┌─ Deal Details ──────────────────┐  │
│  │ Expected Value [₹5,00,000]  │ │
│ │  Probability  [60% ▾] │ │
│ │ Close Date  [DD/MM ▾]  │ │
│ │  Score [72/100]  │ │
│ └────────────────────────────────┘ │
│ │
│ ┌─ Classification ────────────────┐ │
│ │ Tier [Gold ▾]  │ │
│ │  VIP [Yes ▾]  │ │
│ │  Tags [Urgent, Hot]  │ │
│ │  Owner  [Rahul ▾] │  │
│  └────────────────────────────────┘ │
│ │
│  ┌─ Referral ──────────────────────┐  │
│  │ Source Name [___________] │  │
│  │ Relationship [Friend ▾] │ │
│ └────────────────────────────────┘  │
│  │
│  ┌─ Next Action ───────────────────┐  │
│  │  │
│ │  What's next?  [Follow-up ▾] │ │
│ │  │
│  │ ┌─ Follow-up Settings ──────┐  │ │
│ │  │ Type [Weekly ▾] │ │ │
│ │ │ Date [DD/MM/YYYY ▾]  │ │  │
│  │  └──────────────────────────┘ │ │
│ │ │
│ │ OR (switches based on selection): │
│ │  │
│  │ ┌─ Appointment ────────────┐  │ │
│ │  │ Date  [▾]  │ │  │
│  │ │  Time [▾] │ │ │
│ │ │ Place [___________]  │ │  │
│  │ │  Map  [Paste link]  │ │  │
│  │ └──────────────────────────┘ │  │
│  │ │
│ │  ┌─ Video Call ─────────────┐ │  │
│  │ │  Date [▾] │ │ │
│ │ │ Time [▾] │  │ │
│ │ │ Link [___________]  │ │  │
│  │ └──────────────────────────┘ │  │
│  │ │
│ │ ┌─ Callback ───────────────┐ │ │
│ │ │ Date [▾]  │ │  │
│  │ │  Time [▾] │ │ │
│ │ └──────────────────────────┘ │ │
│ │ │
│ └─────────────────────────────────┘ │
│  │
│  ┌─ Tracking ──────────────────────┐  │
│  │ First Contact [DD/MM ▾]  │ │
│ │  Last Contact  [DD/MM ▾]  │ │
│ │  UTM Source  [___________]  │ │
│ │  UTM Medium  [___________] │ │
│ │ UTM Campaign [___________]  │ │
│ └────────────────────────────────┘ │
│ │
└─────────────────────────────────────────┘
```

### Key improvements:

1. **Action Type Switcher** — Instead of showing all 4 conditional blocks (Follow-up, Appointment, Video Call, Callback) stacked vertically, show only the selected one:
 ```kotlin
 binding.layoutLeadType.setOnClickListener {
  val selected = showActionTypePicker()
 when (selected) {
 "Follow-up" -> showFollowUpFields()
 "Appointment" -> showAppointmentFields()
 "Video call" -> showVideoCallFields()
  "Call back" -> showCallbackFields()
 else -> hideAllActionFields()
 }
 }
 ```

2. **Deal value with currency formatting** — Auto-format as `₹` while typing:
 ```kotlin
  val currencyFormatter = NumberFormat.getCurrencyInstance(Locale("en", "IN"))
  ```

3. **Probability slider** — Replace dropdown with a slider:
 ```xml
 <com.google.android.material.slider.Slider
  android:id="@+id/sliderProbability"
 android:layout_width="match_parent"
 android:layout_height="wrap_content"
 app:valueFrom="0"
 app:valueTo="100"
 app:stepSize="5"
 app:labelBehavior="gone" />
 <TextView
 android:id="@+id/tvProbabilityValue"
 android:text="60%" />
 ```

4. **Tags as chips** — Replace dropdown with a chip selector:
 ```xml
 <com.google.android.material.chip.ChipGroup
 android:id="@+id/chipGroupTags"
 app:singleSelection="false">
 <com.google.android.material.chip.Chip
 android:text="VIP"
 app:chipIcon="@drawable/ic_star" />
  <com.google.android.material.chip.Chip
  android:text="Urgent"
 app:chipIcon="@drawable/ic_warning" />
 <com.google.android.material.chip.Chip
 android:text="Hot"
 app:chipIcon="@drawable/ic_fire" />
 <com.google.android.material.chip.Chip
 android:text="Cold"
 app:chipIcon="@drawable/ic_snow" />
  </com.google.android.material.chip.ChipGroup>
 ```

5. **Lead Score with visual bar** — Show score as a colored bar:
 ```xml
 <LinearLayout android:orientation="horizontal">
 <TextView android:text="Score:" />
 <com.google.android.material.progressindicator.LinearProgressIndicator
 android:layout_width="0dp"
 android:layout_weight="1"
 app:trackColor="#E5E7EB"
 app:indicatorColor="@color/scoreColor" />
  <TextView android:text="72/100" />
  </LinearLayout>
 ```

---

## Step 4: Address

### Current fields:
Address Type, Street Address, Address Line 2, Landmark, City, District, State, Pincode, Country

### Redesign — with map preview:

```
┌─────────────────────────────────────────┐
│ 📍 Address Details [▶]  │
│ Location & address information  │
├─────────────────────────────────────────┤
│  │
│  Type  [Permanent ▾]  │
│  │
│  Street  [House/Flat, Building, Street] │
│ │
│ Area [Apartment, suite...]  │
│  Landmark [Near Central Mall]  │
│  │
│  City  [Bangalore]  │
│  District [Bangalore Urban]  │
│  State [Karnataka ▾] │
│ Pincode [560001]  [📍 Lookup]  │
│  Country  [India ▾]  │
│  │
│  ┌─ Map Preview ───────────────────┐  │
│  │ [Static map image or link]  │ │
│ │  [Open in Maps →]  │ │
│ └────────────────────────────────┘ │
│ │
└─────────────────────────────────────────┘
```

### Improvements:

1. **PIN lookup button** — Auto-fills city/district/state when pincode is entered.
2. **Map preview** — Show a static map thumbnail (Google Static Maps API) or just a "Open in Maps" link.
3. **Copy address** — One-tap copy full address as formatted text.

---

## Step 5: Social & Notes

### Current fields:
LinkedIn, Facebook, Twitter, Instagram, Notes, Internal Agent Remarks, Plan Suggested

### Redesign:

```
┌─────────────────────────────────────────┐
│ 📝 Social & Notes  [▶]  │
│  Social profiles & conversation notes │
├─────────────────────────────────────────┤
│ │
│ ┌─ Social Profiles ───────────────┐ │
│ │  💼 LinkedIn  [Paste URL]  │ │
│ │  📘 Facebook  [Paste URL] │  │
│  │  🐦 Twitter  [@username]  │ │
│ │  📷 Instagram [@username]  │ │
│  └────────────────────────────────┘ │
│ │
│  ┌─ Notes ─────────────────────────┐ │
│ │  Requirements & Discussion  │ │
│ │  [Multi-line textarea, 3 lines] │ │
│  └────────────────────────────────┘ │
│ │
│ ┌─ Internal Remarks ──────────────┐ │
│ │  🔒 Private team notes  │ │
│ │  [Multi-line textarea, 3 lines] │ │
│  │  │ │
│ │  (Only visible to agency team, │ │
│ │ NOT shared with customer)  │ │
│ └────────────────────────────────┘ │
│ │
│ ┌─ Suggested Plan ────────────────┐ │
│ │ Product/plan recommendations  │ │
│ │  [Multi-line textarea, 2 lines] │  │
│  └────────────────────────────────┘ │
│ │
└─────────────────────────────────────────┘
```

### Improvements:

1. **Social profile preview** — When URL is pasted, show a tiny profile preview card (avatar + name) using a head request.
2. **Rich text notes** — Use `EditText` with `textStyle="textAppearanceBodyLarge"` for better readability.
3. **Private badge** — Visual indicator on Internal Remarks that it's private:
 ```xml
 <com.google.android.material.badge.BadgeDrawable
  app:backgroundColor="@color/red_500"
 app:badgeText="Private" />
 ```

---

## Step 6: Relations & Interests

### Keep the existing empty-state card pattern but improve:

```
┌─────────────────────────────────────────┐
│ 👥 Relations & Interests  [▶] │
│  Family members & product interests  │
├─────────────────────────────────────────┤
│  │
│  ┌─ Family / Key Relations ────────┐ │
│ │ [No relations added yet]  │ │
│ │  [Dashed border card]  │ │
│ │  [+ Add Relation]  │ │
│ │  │ │
│ │  OR when populated:  │ │
│ │  [Relation 1 card: Spouse, Age] │ │
│ │ [Relation 2 card: Son, Age] │ │
│ │ [+ Add Another]  │ │
│ └────────────────────────────────┘ │
│ │
│ ┌─ Insurance Interests ───────────┐ │
│ │  [No interests added yet]  │ │
│ │  [Dashed border card]  │ │
│ │  [+ Add Interest] │ │
│ │ │ │
│ │ OR when populated: │ │
│ │ [Interest 1: Life, ₹5L cover] │ │
│ │ [Interest 2: Health, Family]  │ │
│ │  [+ Add Another] │ │
│  └────────────────────────────────┘ │
│ │
└─────────────────────────────────────────┘
```

---

## Review & Save Screen

Before saving, show a summary of all entered data:

```
┌─────────────────────────────────────────┐
│ ✅ Review & Save  [▶]  │
│ Confirm details before saving  │
├─────────────────────────────────────────┤
│  │
│  ┌─ Contact ────────────────────────┐ │
│ │ Mr. Jeevan Prakash  │ │
│ │  📱 +91 9876543210 │ │
│ │ ✉️  jeevan@email.com │  │
│  │  🎂 15/08/1990  |  💼 Employed  │ │
│  └────────────────────────────────┘ │
│  │
│  ┌─ Company ───────────────────────┐ │
│ │  🏢 ABC Technologies  │ │
│ │  👤 Senior Manager, IT Dept │ │
│ │  🏭 Technology/IT, 51-200 emp │  │
│  └────────────────────────────────┘ │
│ │
│  ┌─ Pipeline ──────────────────────┐ │
│ │ 🎯 Status: Contacted  │ │
│ │  🔥 Priority: Priority 1  │ │
│ │  💰 Value: ₹5,00,000 | 60% prob │ │
│ │  📅 Follow-up: 25/09  │ │
│ └────────────────────────────────┘ │
│ │
│ ┌─ Address ───────────────────────┐ │
│ │ 123 Main St, Bangalore,  │ │
│ │  Karnataka 560001  │ │
│ └────────────────────────────────┘ │
│ │
│ ┌─ Additional ────────────────────┐  │
│  │ 👥 2 relations │  🛡️ 1 interest│ │
│ │ 📝 Notes: "Interested in..." │ │
│  └────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────┐ │
│ │ [💾 Save Lead]  │ │
│ │  [📋 Save & Add Another]  │ │
│ └─────────────────────────────────┘ │
│ │
└─────────────────────────────────────────┘
```

Each card is tappable — tapping jumps back to that step for editing. This gives a final verification pass and avoids "did I enter that right?" anxiety.

---

## Detailed Field-Level UI Improvements

### Field Row Component (Current vs Improved)

**Current** — all fields look identical:
```
[icon] Label  [arrow OR edittext]
```

**Improved** — differentiated by field type:

| Field Type | Visual Treatment | Example |
|------------|-----------------|---------|
| **Text input** | Full-width EditText with floating label | Name, Email |
| **Selector/Dropdown** | Label + value + chevron, entire row clickable | Status, Industry |
| **Date picker** | Calendar icon + formatted date + chevron | DOB, Close Date |
| **Toggle/Boolean** | Label + Material Switch | DND, VIP, Same as Mobile |
| **Number input** | Label + number keyboard + unit suffix (₹, %, yrs) | Income, Score, Deal Value |
| **Chip selector** | Label + horizontal ChipGroup | Tags, Preferred Contact |
| **Slider** | Label + Slider + live value display | Probability, Score |
| **Multi-line text** | Label + expanded EditText with character count | Notes, Address |
| **Phone with country** | Country flag + code + divider + EditText | Mobile, Alternate, WhatsApp |
| **Search/Lookup** | Label + EditText + action icon (search, scan) | Pincode lookup, Lead search |

### New Reusable Components

```xml
<!-- components/field_text_input.xml -->
<com.google.android.material.textfield.TextInputLayout
 style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox"
 android:layout_width="match_parent"
 android:layout_height="wrap_content"
 app:startIconDrawable="@drawable/ic_person"
 app:startIconTint="@color/icon_tint"
 app:boxStrokeColor="@color/field_border"
 app:boxCornerRadiusTopStart="12dp"
 app:boxCornerRadiusTopEnd="12dp"
 app:boxCornerRadiusBottomStart="12dp"
 app:boxCornerRadiusBottomEnd="12dp">

 <com.google.android.material.textfield.TextInputEditText
 android:layout_width="match_parent"
 android:layout_height="wrap_content"
 android:hint="First Name"
 android:inputType="textPersonName" />
</com.google.android.material.textfield.TextInputLayout>
```

```xml
<!-- components/field_selector.xml -->
<LinearLayout
 style="@style/FieldSelectorContainer"
 android:onClick="@{() -> vm.onFieldClick(fieldId)}">

 <ImageView
 android:layout_width="24dp"
 android:layout_height="24dp"
 app:srcCompat="@drawable/ic_lead"
 app:tint="#2E5BFF" />

 <LinearLayout
 android:layout_width="0dp"
 android:layout_weight="1"
 android:layout_height="wrap_content">

 <TextView
 android:text="Lead Status"
 style="@style/FieldLabel" />

 <TextView
 android:id="@+id/tvValue"
  android:text="Select status"
 style="@style/FieldValue"
 android:textColor="#6F767E" />
 </LinearLayout>

 <ImageView
 android:layout_width="20dp"
 android:layout_height="20dp"
 android:src="@android:drawable/arrow_down_float"
 app:tint="#6F767E" />
</LinearLayout>
```

```xml
<!-- components/field_date_picker.xml -->
<LinearLayout
 style="@style/FieldSelectorContainer"
 android:onClick="@{() -> vm.onDateClick(fieldId)}">

 <ImageView
 android:layout_width="24dp"
 android:layout_height="24dp"
 app:srcCompat="@drawable/ic_calendar"
 app:tint="#2E5BFF" />

 <LinearLayout
 android:layout_width="0dp"
 android:layout_weight="1"
  android:layout_height="wrap_content">

  <TextView
  android:text="Follow-up Date"
  style="@style/FieldLabel" />

 <TextView
 android:id="@+id/tvValue"
  android:text="DD/MM/YYYY"
 style="@style/FieldValue"
 android:textColor="#6F767E" />
 </LinearLayout>

 <ImageView
 android:layout_width="20dp"
 android:layout_height="20dp"
 android:src="@drawable/ic_calendar"
 app:tint="#2E5BFF" />
</LinearLayout>
```

---

## Code Architecture Improvements

### Current problem: 3618-line fragment

The fragment handles: UI setup, picker dialogs, validation, auto-save, Firebase writes, error handling, keyboard management, employee picker, relation/interest card management.

### Target: MVVM with clean separation

```
AddLeadWizardActivity  (hosts ViewPager + stepper)
├── StepPagerAdapter  (fragments per step)
│ ├── StepContactFragment
│ ├── StepCompanyFragment
│ ├── StepPipelineFragment
│ ├── StepAddressFragment
│ ├── StepSocialFragment
│ └── StepRelationsFragment
│
├── AddLeadViewModel  (shared across all steps)
│  ├── UiState  (single data class for entire form)
│ ├── Validation  (field-level validators)
│  ├── Save logic  (single save entry point)
│  └── AutoSave  (debounced draft save)
│
├── ui/
│ ├── components/
│ │  ├── FieldTextInput.kt  (composable/compound view)
│ │ ├── FieldSelector.kt
│ │  ├── FieldDatePicker.kt
│ │  ├── FieldChips.kt
│ │  └── FieldSlider.kt
│ ├── StepContactScreen.kt
│ ├── StepCompanyScreen.kt
│  └── ...
│
└── dialog/
 ├── ListPickerDialog.kt  (reusable dropdown dialog)
 ├── DatePickerDialog.kt
 └── EmployeePickerDialog.kt
```

### Single UiState data class:

```kotlin
data class LeadFormUiState(
  // Contact
 val salutation: String = "",
 val firstName: String = "",
 val lastName: String = "",
  val phone: String = "",
 val phoneCountry: String = "+91",
 val alternatePhone: String = "",
 val whatsApp: String = "",
 val email: String = "",
 val secondaryEmail: String = "",
 val dob: Long? = null,
 val age: String = "",
 val gender: String = "",
 val maritalStatus: String = "",
 val occupation: String = "",
  val pan: String = "",
  val aadhaar: String = "",
 val annualIncome: String = "",
 val noOfChildren: String = "",
 val childrenDetails: String = "",
 val dnd: String = "",
 val marketingConsent: String = "",
  val preferredContactMethod: String = "",
 val bestTimeToCall: String = "",
  val languagePreference: String = "",

 // Company
 val companyName: String = "",
 val companyPhone: String = "",
 val companyEmail: String = "",
 val companyAddress: String = "",
 val decisionMakerRole: String = "",
 val decisionMakerLevel: String = "",
  val jobTitle: String = "",
  val department: String = "",
 val industry: String = "",
 val companySize: String = "",
 val annualRevenue: String = "",
 val website: String = "",

 // Lead Pipeline
 val leadStatus: String = "",
 val leadSource: String = "",
 val leadPriority: String = "",
 val leadScore: String = "",
 val customerTier: String = "",
 val vipFlag: String = "",
 val tags: List<String> = emptyList(),
 val leadOwnerUid: String = "",
 val expectedCloseDate: Long? = null,
 val expectedDealValue: String = "",
  val conversionProbability: Int = 50,
 val campaignName: String = "",
 val referralSourceName: String = "",
 val referralRelationship: String = "",
 val firstContactDate: Long? = null,
 val lastContactDate: Long? = null,
 val lostReason: String = "",
 val scheduledActionType: String = "",
 // Conditional fields
 val followUpType: String = "",
  val followUpDate: Long? = null,
 val appointmentDate: Long? = null,
  val appointmentTime: String = "",
  val appointmentAddress: String = "",
 val addressLocationLink: String = "",
 val videoCallDate: Long? = null,
 val videoCallTime: String = "",
 val callbackDate: Long? = null,
 val callbackTime: String = "",
 val customDate: Long? = null,
 val customTime: String = "",

 // UTM
 val utmSource: String = "",
  val utmMedium: String = "",
 val utmCampaign: String = "",
 val utmTerm: String = "",
  val utmContent: String = "",

 // Address
 val addressType: String = "",
 val streetAddress: String = "",
 val addressLine2: String = "",
 val landmark: String = "",
 val city: String = "",
 val district: String = "",
  val state: String = "",
 val pincode: String = "",
  val country: String = "India",

 // Social
 val linkedIn: String = "",
 val facebook: String = "",
 val twitter: String = "",
  val instagram: String = "",

 // Notes
 val notes: String = "",
 val agentRemarks: String = "",
 val planSuggested: String = "",

  // Relations & Interests (complex types)
 val relations: List<Relation> = emptyList(),
 val interests: List<Interest> = emptyList(),

 // Metadata
 val currentStep: Int = 0,
 val isEditing: Boolean = false,
 val existingLeadId: String? = null,
 val isSaving: Boolean = false,
 val saveError: String? = null
)
```

Each step fragment observes the same `UiState` and only renders its relevant fields. This eliminates the 3618-line monolith.

### Validation as a separate concern:

```kotlin
object LeadFormValidator {
 fun validate(state: LeadFormUiState): ValidationResult {
 val errors = mutableMapOf<String, String>()

 if (state.firstName.isBlank()) errors["firstName"] = "First name is required"
 if (state.lastName.isBlank()) errors["lastName"] = "Last name is required"
 if (state.phone.isBlank()) errors["phone"] = "Mobile number is required"
 if (!isValidPhone(state.phone)) errors["phone"] = "Invalid phone number"
 if (state.email.isNotBlank() && !isValidEmail(state.email)) errors["email"] = "Invalid email"
  if (state.leadStatus.isBlank()) errors["leadStatus"] = "Select a lead status"
 if (state.leadSource.isBlank()) errors["leadSource"] = "Select a lead source"
  if (state.leadPriority.isBlank()) errors["leadPriority"] = "Select priority"
 if (state.scheduledActionType.isBlank()) errors["leadType"] = "Select an action type"

 // Conditional validation
 when (state.scheduledActionType) {
 "Follow-up" -> {
 if (state.followUpType.isBlank()) errors["followUpType"] = "Required"
 if (state.followUpDate == null) errors["followUpDate"] = "Required"
 }
 "Appointment" -> {
  if (state.appointmentDate == null) errors["appointmentDate"] = "Required"
  if (state.appointmentTime.isBlank()) errors["appointmentTime"] = "Required"
  }
  // etc.
 }

  return ValidationResult(errors)
 }
}
```

### Auto-save as debounced Flow:

```kotlin
class AddLeadViewModel @Inject constructor(
 private val repository: AppRepository
) : ViewModel() {

 private val _uiState = MutableStateFlow(LeadFormUiState())
 val uiState: StateFlow<LeadFormUiState> = _uiState.asStateFlow()

 private val _validationErrors = MutableStateFlow<Map<String, String>>(emptyMap())
 val validationErrors: StateFlow<Map<String, String>> = _validationErrors.asStateFlow()

  // Auto-save draft every 30 seconds if form has content
 init {
 viewModelScope.launch {
 _uiState
 .debounce(30_000)
  .filter { it.hasAnyContent() }
  .collect { saveDraft(it) }
  }
 }

 fun updateField(field: String, value: Any) {
 _uiState.update { current ->
 when (field) {
 "firstName" -> current.copy(firstName = value as String)
 "phone" -> current.copy(phone = value as String)
  "leadStatus" -> current.copy(leadStatus = value as String)
 // ... map all fields
 else -> current
 }
  }
 }

  fun saveLead(): Flow<Result<Unit>> = flow {
 val errors = LeadFormValidator.validate(_uiState.value)
 if (errors.hasErrors()) {
 _validationErrors.value = errors.errors
 emit(Result.failure(ValidationException(errors.errors)))
  return@flow
 }
 _uiState.update { it.copy(isSaving = true) }

 val lead = _uiState.value.toLeadEntity()
 val result = repository.saveLead(lead)
 emit(result)
  }.flowOn(Dispatchers.IO)

 private suspend fun saveDraft(state: LeadFormUiState) {
 repository.saveDraft(state.toDraftEntity())
 }
}
```

---

## New Fields to Add That Are Missing

These are CRM-standard fields not currently in your form:

| Field | Section | Type | Why |
|-------|---------|------|-----|
| **Lead Source Detail** | Pipeline | Select | "Website", "Referral", "Cold Call", "Social Media", "Event", "Advertisement" — more granular than generic "source" |
| **Assigned Team** | Pipeline | Multi-select | Assign multiple team members, not just one owner |
| **Follow-up Method** | Action | Chips | Call, WhatsApp, Email, In-person, Video |
| **Meeting Link** | Action | URL | Zoom/Meet link for video appointments |
| **Reminder Setting** | Action | Select | 15min, 30min, 1hr, 1day before |
| **Policy Interest** | Pipeline | Multi-select checkboxes | Life, Health, Motor, Term, Investment, etc. |
| **Budget Range** | Pipeline | Select | Under ₹1L, ₹1-5L, ₹5-10L, ₹10L+ |
| **Urgency** | Pipeline | Select | Immediate, This Month, This Quarter, Exploring |
| **Decision Timeline** | Pipeline | Select | < 1 week, 1-4 weeks, 1-3 months, > 3 months |
| **Competitors Considered** | Pipeline | Multi-select | Other insurers they're evaluating |
| **Address Coordinates** | Address | Auto | GPS coordinates for field agent routing |
| **Preferred Language** | Contact | Select | Already partially there — formalize |
| **Lead Temperature** | Pipeline | Chips | Hot 🔥 / Warm ⚡ / Cold ❄️ |
| **Do Not Call Reason** | Contact | Conditional | If DND = Yes, show reason dropdown |

---

## Visual Design System

### Color Palette

```xml
<!-- res/values/colors.xml additions -->
<color name="primary">#2E5BFF</color>
<color name="primary_light">#E8F0FF</color>
<color name="success">#27AE60</color>
<color name="warning">#F2994A</color>
<color name="danger">#EB5757</color>
<color name="score_high">#27AE60</color> <!-- 70-100 -->
<color name="score_medium">#F2994A</color> <!-- 40-69 -->
<color name="score_low">#EB5757</color> <!-- 0-39 -->
<color name="field_border">#D1D5DB</color>
<color name="field_focused">#2E5BFF</color>
<color name="field_error">#EB5757</color>
<color name="track_switch">#D1D5DB</color>
<color name="section_bg">#F9FAFB</color>
```

### Typography Scale

```xml
<!-- res/values/themes.xml or styles.xml -->
<style name="TextAppearance.Anbu.FieldLabel">
 <item name="android:textSize">12sp</item>
 <item name="android:textColor">#6F767E</item>
 <item name="android:textStyle">medium</item>
  <item name="android:letterSpacing">0.02</item>
</style>

<style name="TextAppearance.Anbu.FieldValue">
  <item name="android:textSize">14sp</item>
 <item name="android:textColor">#1A1D1F</item>
</style>

<style name="TextAppearance.Anbu.FieldValuePlaceholder">
 <item name="android:textSize">14sp</item>
 <item name="android:textColor">#9CA3AF</item>
</style>

<style name="TextAppearance.Anbu.SectionTitle">
  <item name="android:textSize">16sp</item>
 <item name="android:textColor">#1A1D1F</item>
 <item name="android:textStyle">bold</item>
</style>

<style name="TextAppearance.Anbu.SectionSubtitle">
 <item name="android:textSize">12sp</item>
 <item name="android:textColor">#6F767E</item>
</style>
```

### Field Row Component Style

```xml
<style name="Widget.Anbu.FieldSelector">
 <item name="android:layout_width">match_parent</item>
 <item name="android:layout_height">56dp</item>
 <item name="android:background">@drawable/bg_field_selector</item>
  <item name="android:paddingStart">16dp</item>
 <item name="android:paddingEnd">16dp</item>
 <item name="android:gravity">center_vertical</item>
 <item name="android:clickable">true</item>
  <item name="android:focusable">true</item>
  <item name="android:foreground">?attr/selectableItemBackground</item>
</style>

<!-- bg_field_selector.xml -->
<selector xmlns:android="http://schemas.android.com/apk/res/android">
 <item android:state_pressed="true">
 <shape android:shape="rectangle">
 <solid android:color="#F3F4F6" />
 <corners android:radius="12dp" />
  </shape>
  </item>
  <item>
 <shape android:shape="rectangle">
 <solid android:color="#FFFFFF" />
  <corners android:radius="12dp" />
  <stroke android:width="1dp" android:color="#E5E7EB" />
 </shape>
 </item>
</selector>
```

### Section Card Style

```xml
<style name="Widget.Anbu.SectionCard">
 <item name="cardBackgroundColor">#FFFFFF</item>
 <item name="cardCornerRadius">16dp</item>
 <item name="cardElevation">0dp</item>
 <item name="strokeColor">#E5E7EB</item>
  <item name="strokeWidth">1dp</item>
 <item name="contentPadding">16dp</item>
</style>
```

### Error State Style

```xml
<!-- edittext_rounded_error.xml -->
<selector xmlns:android="http://schemas.android.com/apk/res/android">
  <item>
  <shape android:shape="rectangle">
 <solid android:color="#FEF2F2" />
 <corners android:radius="12dp" />
 <stroke android:width="1.5dp" android:color="#EB5757" />
 </shape>
 </item>
</selector>
```

---

## Interaction Patterns Summary

| Interaction | Current | Improved |
|-------------|---------|----------|
| **Navigation** | Single scroll, all fields visible | Stepper wizard with progress bar |
| **Dropdowns** | `showListPicker()` AlertDialog | Consistent bottom sheet with search |
| **Date fields** | `DatePickerDialog` | Calendar bottom sheet with range selection |
| **Toggles** | Dropdown with Yes/No | `MaterialSwitch` for boolean, dropdown for multi-option |
| **Multi-select** | None | `ChipGroup` for tags, contact methods |
| **Number input** | Raw EditText | With suffix (₹, %, yrs), auto-formatting |
| **Phone** | CountryCodePicker + EditText | Keep but add auto-formatting (XXX-XXXX) |
| **Auto-save** | Every 30s (in code) | Debounced with visual "Saved ✓" indicator |
| **Validation** | On save only | Real-time per-field, show errors as you go |
| **Save button** | Always enabled | Disabled until required fields pass validation |
| **Back button** | `onBackPressed` | "Save draft?" dialog if form has unsaved changes |
| **Duplicate detection** | Separate dialog after save | Inline warning banner on phone field |

---

## Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| **P0** | Stepper wizard split (6 steps) | 3 days | Massive UX improvement |
| **P0** | Extract UiState data class | 1 day | Foundation for everything |
| **P1** | Action type switcher (show only selected fields) | 1 day | Reduces form length |
| **P1** | Replace dropdown Yes/No with Switches | 0.5 day | Quick win |
| **P1** | Tags as ChipGroup | 0.5 day | Quick win |
| **P1** | Probability slider | 0.5 day | Quick win |
| **P1** | "Save draft" with visual indicator | 0.5 day | User confidence |
| **P2** | PIN auto-lookup | 1 day | Smart feature |
| **P2** | PAN/Aadhaar formatting | 0.5 day | Quick win |
| **P2** | Deal value currency formatting | 0.5 day | Quick win |
| **P2** | Review & Save summary screen | 1.5 days | Prevents errors |
| **P3** | Social profile preview | 2 days | Nice-to-have |
| **P3** | Map preview for address | 1 day | Nice-to-have |
| **P3** | Sub-group cards within sections | 2 days | Visual polish |

**Total for P0+P1**: ~7 days of work to get a dramatically better form.

Want me to start building any of these? I'd recommend starting with the **UiState data class + stepper wizard split** since that's the foundation everything else builds on.

BEst simple modern website for andoid deleop this only one app section

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/08597665-2ed9-4416-8752-b62dae8bbf3f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
