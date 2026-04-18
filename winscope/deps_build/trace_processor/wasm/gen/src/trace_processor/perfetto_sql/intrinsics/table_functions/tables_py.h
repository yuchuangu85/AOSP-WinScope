#ifndef SRC_TRACE_PROCESSOR_PERFETTO_SQL_INTRINSICS_TABLE_FUNCTIONS_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_PERFETTO_SQL_INTRINSICS_TABLE_FUNCTIONS_TABLES_PY_H_

#include <array>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <optional>
#include <type_traits>
#include <utility>
#include <vector>

#include "perfetto/base/logging.h"
#include "perfetto/trace_processor/basic_types.h"
#include "perfetto/trace_processor/ref_counted.h"
#include "src/trace_processor/containers/bit_vector.h"
#include "src/trace_processor/containers/row_map.h"
#include "src/trace_processor/containers/string_pool.h"
#include "src/trace_processor/db/column/arrangement_overlay.h"
#include "src/trace_processor/db/column/data_layer.h"
#include "src/trace_processor/db/column/dense_null_overlay.h"
#include "src/trace_processor/db/column/numeric_storage.h"
#include "src/trace_processor/db/column/id_storage.h"
#include "src/trace_processor/db/column/null_overlay.h"
#include "src/trace_processor/db/column/range_overlay.h"
#include "src/trace_processor/db/column/selector_overlay.h"
#include "src/trace_processor/db/column/set_id_storage.h"
#include "src/trace_processor/db/column/string_storage.h"
#include "src/trace_processor/db/column/types.h"
#include "src/trace_processor/db/column_storage.h"
#include "src/trace_processor/db/column.h"
#include "src/trace_processor/db/table.h"
#include "src/trace_processor/db/typed_column.h"
#include "src/trace_processor/db/typed_column_internal.h"
#include "src/trace_processor/tables/macros_internal.h"

#include "src/trace_processor/tables/flow_tables_py.h"
#include "src/trace_processor/tables/profiler_tables_py.h"
#include "src/trace_processor/tables/slice_tables_py.h"

namespace perfetto::trace_processor::tables {

class AncestorSliceByStackTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 16;

  using Id = SliceTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
    static constexpr uint32_t start_stack_id = 15;
  };
  struct ColumnType {
    using id = IdColumn<AncestorSliceByStackTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using depth = TypedColumn<uint32_t>;
    using stack_id = TypedColumn<int64_t>;
    using parent_stack_id = TypedColumn<int64_t>;
    using parent_id = TypedColumn<std::optional<AncestorSliceByStackTable::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using thread_ts = TypedColumn<std::optional<int64_t>>;
    using thread_dur = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_count = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_delta = TypedColumn<std::optional<int64_t>>;
    using start_stack_id = TypedColumn<int64_t>;
  };
  struct Row : public SliceTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        uint32_t in_depth = {},
        int64_t in_stack_id = {},
        int64_t in_parent_stack_id = {},
        std::optional<AncestorSliceByStackTable::Id> in_parent_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<int64_t> in_thread_ts = {},
        std::optional<int64_t> in_thread_dur = {},
        std::optional<int64_t> in_thread_instruction_count = {},
        std::optional<int64_t> in_thread_instruction_delta = {},
        int64_t in_start_stack_id = {},
        std::nullptr_t = nullptr)
        : SliceTable::Row(in_ts, in_dur, in_track_id, in_category, in_name, in_depth, in_stack_id, in_parent_stack_id, in_parent_id, in_arg_set_id, in_thread_ts, in_thread_dur, in_thread_instruction_count, in_thread_instruction_delta),
          start_stack_id(in_start_stack_id) {}
    int64_t start_stack_id;

    bool operator==(const AncestorSliceByStackTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::stack_id::Equals(stack_id, other.stack_id) &&
       ColumnType::parent_stack_id::Equals(parent_stack_id, other.parent_stack_id) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::thread_ts::Equals(thread_ts, other.thread_ts) &&
       ColumnType::thread_dur::Equals(thread_dur, other.thread_dur) &&
       ColumnType::thread_instruction_count::Equals(thread_instruction_count, other.thread_instruction_count) &&
       ColumnType::thread_instruction_delta::Equals(thread_instruction_delta, other.thread_instruction_delta) &&
       ColumnType::start_stack_id::Equals(start_stack_id, other.start_stack_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t start_stack_id = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_stack_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      AncestorSliceByStackTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    AncestorSliceByStackTable, RowNumber> {
   public:
    ConstRowReference(const AncestorSliceByStackTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::stack_id::type stack_id() const {
      return table()->stack_id()[row_number_];
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      return table()->parent_stack_id()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::thread_ts::type thread_ts() const {
      return table()->thread_ts()[row_number_];
    }
    ColumnType::thread_dur::type thread_dur() const {
      return table()->thread_dur()[row_number_];
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      return table()->thread_instruction_count()[row_number_];
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      return table()->thread_instruction_delta()[row_number_];
    }
    ColumnType::start_stack_id::type start_stack_id() const {
      return table()->start_stack_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const AncestorSliceByStackTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_stack_id(
        ColumnType::stack_id::non_optional_type v) {
      return mutable_table()->mutable_stack_id()->Set(row_number_, v);
    }
    void set_parent_stack_id(
        ColumnType::parent_stack_id::non_optional_type v) {
      return mutable_table()->mutable_parent_stack_id()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_thread_ts(
        ColumnType::thread_ts::non_optional_type v) {
      return mutable_table()->mutable_thread_ts()->Set(row_number_, v);
    }
    void set_thread_dur(
        ColumnType::thread_dur::non_optional_type v) {
      return mutable_table()->mutable_thread_dur()->Set(row_number_, v);
    }
    void set_thread_instruction_count(
        ColumnType::thread_instruction_count::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_count()->Set(row_number_, v);
    }
    void set_thread_instruction_delta(
        ColumnType::thread_instruction_delta::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_delta()->Set(row_number_, v);
    }
    void set_start_stack_id(
        ColumnType::start_stack_id::non_optional_type v) {
      return mutable_table()->mutable_start_stack_id()->Set(row_number_, v);
    }

   private:
    AncestorSliceByStackTable* mutable_table() const {
      return const_cast<AncestorSliceByStackTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, AncestorSliceByStackTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stack_id::type stack_id() const {
      const auto& col = table()->stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      const auto& col = table()->parent_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_ts::type thread_ts() const {
      const auto& col = table()->thread_ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_dur::type thread_dur() const {
      const auto& col = table()->thread_dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      const auto& col = table()->thread_instruction_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      const auto& col = table()->thread_instruction_delta();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_stack_id::type start_stack_id() const {
      const auto& col = table()->start_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const AncestorSliceByStackTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class AncestorSliceByStackTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, AncestorSliceByStackTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<AncestorSliceByStackTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class AncestorSliceByStackTable;

     explicit Iterator(AncestorSliceByStackTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      AncestorSliceByStackTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "start_stack_id", &self->start_stack_id_, ColumnFlag::start_stack_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit AncestorSliceByStackTable(StringPool* pool, SliceTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), start_stack_id_(ColumnStorage<ColumnType::start_stack_id::stored_type>::Create<false>())
,
        start_stack_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_stack_id::non_optional_stored_type>(
          &start_stack_id_.vector(),
          ColumnTypeHelper<ColumnType::start_stack_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_stack_id::stored_type>(
          ColumnFlag::start_stack_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_stack_id_storage_layer_},
      {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}});
  }
  ~AncestorSliceByStackTable() override;

  static const char* Name() { return "ancestor_slice_by_stack"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stack_id", ColumnType::stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_stack_id", ColumnType::parent_stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_ts", ColumnType::thread_ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_dur", ColumnType::thread_dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_count", ColumnType::thread_instruction_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_delta", ColumnType::thread_instruction_delta::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_stack_id", ColumnType::start_stack_id::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    start_stack_id_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_start_stack_id()->Append(row.start_stack_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<AncestorSliceByStackTable> ExtendParent(
      const SliceTable& parent,
      ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id) {
    return std::unique_ptr<AncestorSliceByStackTable>(new AncestorSliceByStackTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(start_stack_id)));
  }

  static std::unique_ptr<AncestorSliceByStackTable> SelectAndExtendParent(
      const SliceTable& parent,
      std::vector<SliceTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<AncestorSliceByStackTable>(new AncestorSliceByStackTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(start_stack_id)));
  }

  const IdColumn<AncestorSliceByStackTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<int64_t>& stack_id() const {
    return static_cast<const ColumnType::stack_id&>(columns()[ColumnIndex::stack_id]);
  }
  const TypedColumn<int64_t>& parent_stack_id() const {
    return static_cast<const ColumnType::parent_stack_id&>(columns()[ColumnIndex::parent_stack_id]);
  }
  const TypedColumn<std::optional<AncestorSliceByStackTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_ts() const {
    return static_cast<const ColumnType::thread_ts&>(columns()[ColumnIndex::thread_ts]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_dur() const {
    return static_cast<const ColumnType::thread_dur&>(columns()[ColumnIndex::thread_dur]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_count() const {
    return static_cast<const ColumnType::thread_instruction_count&>(columns()[ColumnIndex::thread_instruction_count]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_delta() const {
    return static_cast<const ColumnType::thread_instruction_delta&>(columns()[ColumnIndex::thread_instruction_delta]);
  }
  const TypedColumn<int64_t>& start_stack_id() const {
    return static_cast<const ColumnType::start_stack_id&>(columns()[ColumnIndex::start_stack_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<int64_t>* mutable_stack_id() {
    return static_cast<ColumnType::stack_id*>(
        GetColumn(ColumnIndex::stack_id));
  }
  TypedColumn<int64_t>* mutable_parent_stack_id() {
    return static_cast<ColumnType::parent_stack_id*>(
        GetColumn(ColumnIndex::parent_stack_id));
  }
  TypedColumn<std::optional<AncestorSliceByStackTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_ts() {
    return static_cast<ColumnType::thread_ts*>(
        GetColumn(ColumnIndex::thread_ts));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_dur() {
    return static_cast<ColumnType::thread_dur*>(
        GetColumn(ColumnIndex::thread_dur));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_count() {
    return static_cast<ColumnType::thread_instruction_count*>(
        GetColumn(ColumnIndex::thread_instruction_count));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_delta() {
    return static_cast<ColumnType::thread_instruction_delta*>(
        GetColumn(ColumnIndex::thread_instruction_delta));
  }
  TypedColumn<int64_t>* mutable_start_stack_id() {
    return static_cast<ColumnType::start_stack_id*>(
        GetColumn(ColumnIndex::start_stack_id));
  }

 private:
  AncestorSliceByStackTable(StringPool* pool,
            const SliceTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        start_stack_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_stack_id::non_optional_stored_type>(
          &start_stack_id_.vector(),
          ColumnTypeHelper<ColumnType::start_stack_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_stack_id::stored_type>(
          ColumnFlag::start_stack_id),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(start_stack_id.size() == parent_overlay.size());
    start_stack_id_ = std::move(start_stack_id);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_stack_id_storage_layer_}, {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}}, std::move(overlay_layers));
  }
  SliceTable* parent_ = nullptr;
  const SliceTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id_;

  RefPtr<column::StorageLayer> start_stack_id_storage_layer_;

  
};
  

class AncestorSliceTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 16;

  using Id = SliceTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
    static constexpr uint32_t start_id = 15;
  };
  struct ColumnType {
    using id = IdColumn<AncestorSliceTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using depth = TypedColumn<uint32_t>;
    using stack_id = TypedColumn<int64_t>;
    using parent_stack_id = TypedColumn<int64_t>;
    using parent_id = TypedColumn<std::optional<AncestorSliceTable::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using thread_ts = TypedColumn<std::optional<int64_t>>;
    using thread_dur = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_count = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_delta = TypedColumn<std::optional<int64_t>>;
    using start_id = TypedColumn<SliceTable::Id>;
  };
  struct Row : public SliceTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        uint32_t in_depth = {},
        int64_t in_stack_id = {},
        int64_t in_parent_stack_id = {},
        std::optional<AncestorSliceTable::Id> in_parent_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<int64_t> in_thread_ts = {},
        std::optional<int64_t> in_thread_dur = {},
        std::optional<int64_t> in_thread_instruction_count = {},
        std::optional<int64_t> in_thread_instruction_delta = {},
        SliceTable::Id in_start_id = {},
        std::nullptr_t = nullptr)
        : SliceTable::Row(in_ts, in_dur, in_track_id, in_category, in_name, in_depth, in_stack_id, in_parent_stack_id, in_parent_id, in_arg_set_id, in_thread_ts, in_thread_dur, in_thread_instruction_count, in_thread_instruction_delta),
          start_id(in_start_id) {}
    SliceTable::Id start_id;

    bool operator==(const AncestorSliceTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::stack_id::Equals(stack_id, other.stack_id) &&
       ColumnType::parent_stack_id::Equals(parent_stack_id, other.parent_stack_id) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::thread_ts::Equals(thread_ts, other.thread_ts) &&
       ColumnType::thread_dur::Equals(thread_dur, other.thread_dur) &&
       ColumnType::thread_instruction_count::Equals(thread_instruction_count, other.thread_instruction_count) &&
       ColumnType::thread_instruction_delta::Equals(thread_instruction_delta, other.thread_instruction_delta) &&
       ColumnType::start_id::Equals(start_id, other.start_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t start_id = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      AncestorSliceTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    AncestorSliceTable, RowNumber> {
   public:
    ConstRowReference(const AncestorSliceTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::stack_id::type stack_id() const {
      return table()->stack_id()[row_number_];
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      return table()->parent_stack_id()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::thread_ts::type thread_ts() const {
      return table()->thread_ts()[row_number_];
    }
    ColumnType::thread_dur::type thread_dur() const {
      return table()->thread_dur()[row_number_];
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      return table()->thread_instruction_count()[row_number_];
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      return table()->thread_instruction_delta()[row_number_];
    }
    ColumnType::start_id::type start_id() const {
      return table()->start_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const AncestorSliceTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_stack_id(
        ColumnType::stack_id::non_optional_type v) {
      return mutable_table()->mutable_stack_id()->Set(row_number_, v);
    }
    void set_parent_stack_id(
        ColumnType::parent_stack_id::non_optional_type v) {
      return mutable_table()->mutable_parent_stack_id()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_thread_ts(
        ColumnType::thread_ts::non_optional_type v) {
      return mutable_table()->mutable_thread_ts()->Set(row_number_, v);
    }
    void set_thread_dur(
        ColumnType::thread_dur::non_optional_type v) {
      return mutable_table()->mutable_thread_dur()->Set(row_number_, v);
    }
    void set_thread_instruction_count(
        ColumnType::thread_instruction_count::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_count()->Set(row_number_, v);
    }
    void set_thread_instruction_delta(
        ColumnType::thread_instruction_delta::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_delta()->Set(row_number_, v);
    }
    void set_start_id(
        ColumnType::start_id::non_optional_type v) {
      return mutable_table()->mutable_start_id()->Set(row_number_, v);
    }

   private:
    AncestorSliceTable* mutable_table() const {
      return const_cast<AncestorSliceTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, AncestorSliceTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stack_id::type stack_id() const {
      const auto& col = table()->stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      const auto& col = table()->parent_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_ts::type thread_ts() const {
      const auto& col = table()->thread_ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_dur::type thread_dur() const {
      const auto& col = table()->thread_dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      const auto& col = table()->thread_instruction_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      const auto& col = table()->thread_instruction_delta();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_id::type start_id() const {
      const auto& col = table()->start_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const AncestorSliceTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class AncestorSliceTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, AncestorSliceTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<AncestorSliceTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class AncestorSliceTable;

     explicit Iterator(AncestorSliceTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      AncestorSliceTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "start_id", &self->start_id_, ColumnFlag::start_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit AncestorSliceTable(StringPool* pool, SliceTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), start_id_(ColumnStorage<ColumnType::start_id::stored_type>::Create<false>())
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_id_storage_layer_},
      {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}});
  }
  ~AncestorSliceTable() override;

  static const char* Name() { return "ancestor_slice"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stack_id", ColumnType::stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_stack_id", ColumnType::parent_stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_ts", ColumnType::thread_ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_dur", ColumnType::thread_dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_count", ColumnType::thread_instruction_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_delta", ColumnType::thread_instruction_delta::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_id", ColumnType::start_id::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    start_id_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_start_id()->Append(row.start_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<AncestorSliceTable> ExtendParent(
      const SliceTable& parent,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    return std::unique_ptr<AncestorSliceTable>(new AncestorSliceTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(start_id)));
  }

  static std::unique_ptr<AncestorSliceTable> SelectAndExtendParent(
      const SliceTable& parent,
      std::vector<SliceTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<AncestorSliceTable>(new AncestorSliceTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(start_id)));
  }

  const IdColumn<AncestorSliceTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<int64_t>& stack_id() const {
    return static_cast<const ColumnType::stack_id&>(columns()[ColumnIndex::stack_id]);
  }
  const TypedColumn<int64_t>& parent_stack_id() const {
    return static_cast<const ColumnType::parent_stack_id&>(columns()[ColumnIndex::parent_stack_id]);
  }
  const TypedColumn<std::optional<AncestorSliceTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_ts() const {
    return static_cast<const ColumnType::thread_ts&>(columns()[ColumnIndex::thread_ts]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_dur() const {
    return static_cast<const ColumnType::thread_dur&>(columns()[ColumnIndex::thread_dur]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_count() const {
    return static_cast<const ColumnType::thread_instruction_count&>(columns()[ColumnIndex::thread_instruction_count]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_delta() const {
    return static_cast<const ColumnType::thread_instruction_delta&>(columns()[ColumnIndex::thread_instruction_delta]);
  }
  const TypedColumn<SliceTable::Id>& start_id() const {
    return static_cast<const ColumnType::start_id&>(columns()[ColumnIndex::start_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<int64_t>* mutable_stack_id() {
    return static_cast<ColumnType::stack_id*>(
        GetColumn(ColumnIndex::stack_id));
  }
  TypedColumn<int64_t>* mutable_parent_stack_id() {
    return static_cast<ColumnType::parent_stack_id*>(
        GetColumn(ColumnIndex::parent_stack_id));
  }
  TypedColumn<std::optional<AncestorSliceTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_ts() {
    return static_cast<ColumnType::thread_ts*>(
        GetColumn(ColumnIndex::thread_ts));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_dur() {
    return static_cast<ColumnType::thread_dur*>(
        GetColumn(ColumnIndex::thread_dur));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_count() {
    return static_cast<ColumnType::thread_instruction_count*>(
        GetColumn(ColumnIndex::thread_instruction_count));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_delta() {
    return static_cast<ColumnType::thread_instruction_delta*>(
        GetColumn(ColumnIndex::thread_instruction_delta));
  }
  TypedColumn<SliceTable::Id>* mutable_start_id() {
    return static_cast<ColumnType::start_id*>(
        GetColumn(ColumnIndex::start_id));
  }

 private:
  AncestorSliceTable(StringPool* pool,
            const SliceTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::start_id::stored_type> start_id)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(start_id.size() == parent_overlay.size());
    start_id_ = std::move(start_id);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_id_storage_layer_}, {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}}, std::move(overlay_layers));
  }
  SliceTable* parent_ = nullptr;
  const SliceTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::start_id::stored_type> start_id_;

  RefPtr<column::StorageLayer> start_id_storage_layer_;

  
};
  

class AncestorStackProfileCallsiteTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 5;

  using Id = StackProfileCallsiteTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t depth = 1;
    static constexpr uint32_t parent_id = 2;
    static constexpr uint32_t frame_id = 3;
    static constexpr uint32_t start_id = 4;
  };
  struct ColumnType {
    using id = IdColumn<AncestorStackProfileCallsiteTable::Id>;
    using depth = TypedColumn<uint32_t>;
    using parent_id = TypedColumn<std::optional<AncestorStackProfileCallsiteTable::Id>>;
    using frame_id = TypedColumn<StackProfileFrameTable::Id>;
    using start_id = TypedColumn<StackProfileCallsiteTable::Id>;
  };
  struct Row : public StackProfileCallsiteTable::Row {
    Row(uint32_t in_depth = {},
        std::optional<AncestorStackProfileCallsiteTable::Id> in_parent_id = {},
        StackProfileFrameTable::Id in_frame_id = {},
        StackProfileCallsiteTable::Id in_start_id = {},
        std::nullptr_t = nullptr)
        : StackProfileCallsiteTable::Row(in_depth, in_parent_id, in_frame_id),
          start_id(in_start_id) {}
    StackProfileCallsiteTable::Id start_id;

    bool operator==(const AncestorStackProfileCallsiteTable::Row& other) const {
      return ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::frame_id::Equals(frame_id, other.frame_id) &&
       ColumnType::start_id::Equals(start_id, other.start_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t start_id = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      AncestorStackProfileCallsiteTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    AncestorStackProfileCallsiteTable, RowNumber> {
   public:
    ConstRowReference(const AncestorStackProfileCallsiteTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::frame_id::type frame_id() const {
      return table()->frame_id()[row_number_];
    }
    ColumnType::start_id::type start_id() const {
      return table()->start_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const AncestorStackProfileCallsiteTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_frame_id(
        ColumnType::frame_id::non_optional_type v) {
      return mutable_table()->mutable_frame_id()->Set(row_number_, v);
    }
    void set_start_id(
        ColumnType::start_id::non_optional_type v) {
      return mutable_table()->mutable_start_id()->Set(row_number_, v);
    }

   private:
    AncestorStackProfileCallsiteTable* mutable_table() const {
      return const_cast<AncestorStackProfileCallsiteTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, AncestorStackProfileCallsiteTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::frame_id::type frame_id() const {
      const auto& col = table()->frame_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_id::type start_id() const {
      const auto& col = table()->start_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const AncestorStackProfileCallsiteTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class AncestorStackProfileCallsiteTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, AncestorStackProfileCallsiteTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<AncestorStackProfileCallsiteTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class AncestorStackProfileCallsiteTable;

     explicit Iterator(AncestorStackProfileCallsiteTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      AncestorStackProfileCallsiteTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "start_id", &self->start_id_, ColumnFlag::start_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit AncestorStackProfileCallsiteTable(StringPool* pool, StackProfileCallsiteTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), start_id_(ColumnStorage<ColumnType::start_id::stored_type>::Create<false>())
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::frame_id],start_id_storage_layer_},
      {{},{},const_parent_->null_layers()[ColumnIndex::parent_id],{},{}});
  }
  ~AncestorStackProfileCallsiteTable() override;

  static const char* Name() { return "experimental_ancestor_stack_profile_callsite"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "frame_id", ColumnType::frame_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_id", ColumnType::start_id::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    start_id_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_start_id()->Append(row.start_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<AncestorStackProfileCallsiteTable> ExtendParent(
      const StackProfileCallsiteTable& parent,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    return std::unique_ptr<AncestorStackProfileCallsiteTable>(new AncestorStackProfileCallsiteTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(start_id)));
  }

  static std::unique_ptr<AncestorStackProfileCallsiteTable> SelectAndExtendParent(
      const StackProfileCallsiteTable& parent,
      std::vector<StackProfileCallsiteTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<AncestorStackProfileCallsiteTable>(new AncestorStackProfileCallsiteTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(start_id)));
  }

  const IdColumn<AncestorStackProfileCallsiteTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<std::optional<AncestorStackProfileCallsiteTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<StackProfileFrameTable::Id>& frame_id() const {
    return static_cast<const ColumnType::frame_id&>(columns()[ColumnIndex::frame_id]);
  }
  const TypedColumn<StackProfileCallsiteTable::Id>& start_id() const {
    return static_cast<const ColumnType::start_id&>(columns()[ColumnIndex::start_id]);
  }

  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<std::optional<AncestorStackProfileCallsiteTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<StackProfileFrameTable::Id>* mutable_frame_id() {
    return static_cast<ColumnType::frame_id*>(
        GetColumn(ColumnIndex::frame_id));
  }
  TypedColumn<StackProfileCallsiteTable::Id>* mutable_start_id() {
    return static_cast<ColumnType::start_id*>(
        GetColumn(ColumnIndex::start_id));
  }

 private:
  AncestorStackProfileCallsiteTable(StringPool* pool,
            const StackProfileCallsiteTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::start_id::stored_type> start_id)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(start_id.size() == parent_overlay.size());
    start_id_ = std::move(start_id);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::frame_id],start_id_storage_layer_}, {{},{},const_parent_->null_layers()[ColumnIndex::parent_id],{},{}}, std::move(overlay_layers));
  }
  StackProfileCallsiteTable* parent_ = nullptr;
  const StackProfileCallsiteTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::start_id::stored_type> start_id_;

  RefPtr<column::StorageLayer> start_id_storage_layer_;

  
};
  

class ConnectedFlowTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 6;

  using Id = FlowTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t slice_out = 1;
    static constexpr uint32_t slice_in = 2;
    static constexpr uint32_t trace_id = 3;
    static constexpr uint32_t arg_set_id = 4;
    static constexpr uint32_t start_id = 5;
  };
  struct ColumnType {
    using id = IdColumn<ConnectedFlowTable::Id>;
    using slice_out = TypedColumn<SliceTable::Id>;
    using slice_in = TypedColumn<SliceTable::Id>;
    using trace_id = TypedColumn<std::optional<int64_t>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using start_id = TypedColumn<SliceTable::Id>;
  };
  struct Row : public FlowTable::Row {
    Row(SliceTable::Id in_slice_out = {},
        SliceTable::Id in_slice_in = {},
        std::optional<int64_t> in_trace_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        SliceTable::Id in_start_id = {},
        std::nullptr_t = nullptr)
        : FlowTable::Row(in_slice_out, in_slice_in, in_trace_id, in_arg_set_id),
          start_id(in_start_id) {}
    SliceTable::Id start_id;

    bool operator==(const ConnectedFlowTable::Row& other) const {
      return ColumnType::slice_out::Equals(slice_out, other.slice_out) &&
       ColumnType::slice_in::Equals(slice_in, other.slice_in) &&
       ColumnType::trace_id::Equals(trace_id, other.trace_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::start_id::Equals(start_id, other.start_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t start_id = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ConnectedFlowTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ConnectedFlowTable, RowNumber> {
   public:
    ConstRowReference(const ConnectedFlowTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::slice_out::type slice_out() const {
      return table()->slice_out()[row_number_];
    }
    ColumnType::slice_in::type slice_in() const {
      return table()->slice_in()[row_number_];
    }
    ColumnType::trace_id::type trace_id() const {
      return table()->trace_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::start_id::type start_id() const {
      return table()->start_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ConnectedFlowTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_slice_out(
        ColumnType::slice_out::non_optional_type v) {
      return mutable_table()->mutable_slice_out()->Set(row_number_, v);
    }
    void set_slice_in(
        ColumnType::slice_in::non_optional_type v) {
      return mutable_table()->mutable_slice_in()->Set(row_number_, v);
    }
    void set_trace_id(
        ColumnType::trace_id::non_optional_type v) {
      return mutable_table()->mutable_trace_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_start_id(
        ColumnType::start_id::non_optional_type v) {
      return mutable_table()->mutable_start_id()->Set(row_number_, v);
    }

   private:
    ConnectedFlowTable* mutable_table() const {
      return const_cast<ConnectedFlowTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ConnectedFlowTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::slice_out::type slice_out() const {
      const auto& col = table()->slice_out();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::slice_in::type slice_in() const {
      const auto& col = table()->slice_in();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::trace_id::type trace_id() const {
      const auto& col = table()->trace_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_id::type start_id() const {
      const auto& col = table()->start_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ConnectedFlowTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ConnectedFlowTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ConnectedFlowTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ConnectedFlowTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ConnectedFlowTable;

     explicit Iterator(ConnectedFlowTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ConnectedFlowTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "start_id", &self->start_id_, ColumnFlag::start_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ConnectedFlowTable(StringPool* pool, FlowTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), start_id_(ColumnStorage<ColumnType::start_id::stored_type>::Create<false>())
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::slice_out],const_parent_->storage_layers()[ColumnIndex::slice_in],const_parent_->storage_layers()[ColumnIndex::trace_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],start_id_storage_layer_},
      {{},{},{},const_parent_->null_layers()[ColumnIndex::trace_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],{}});
  }
  ~ConnectedFlowTable() override;

  static const char* Name() { return "not_exposed_to_sql"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "slice_out", ColumnType::slice_out::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "slice_in", ColumnType::slice_in::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "trace_id", ColumnType::trace_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_id", ColumnType::start_id::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    start_id_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_start_id()->Append(row.start_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<ConnectedFlowTable> ExtendParent(
      const FlowTable& parent,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    return std::unique_ptr<ConnectedFlowTable>(new ConnectedFlowTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(start_id)));
  }

  static std::unique_ptr<ConnectedFlowTable> SelectAndExtendParent(
      const FlowTable& parent,
      std::vector<FlowTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<ConnectedFlowTable>(new ConnectedFlowTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(start_id)));
  }

  const IdColumn<ConnectedFlowTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<SliceTable::Id>& slice_out() const {
    return static_cast<const ColumnType::slice_out&>(columns()[ColumnIndex::slice_out]);
  }
  const TypedColumn<SliceTable::Id>& slice_in() const {
    return static_cast<const ColumnType::slice_in&>(columns()[ColumnIndex::slice_in]);
  }
  const TypedColumn<std::optional<int64_t>>& trace_id() const {
    return static_cast<const ColumnType::trace_id&>(columns()[ColumnIndex::trace_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<SliceTable::Id>& start_id() const {
    return static_cast<const ColumnType::start_id&>(columns()[ColumnIndex::start_id]);
  }

  TypedColumn<SliceTable::Id>* mutable_slice_out() {
    return static_cast<ColumnType::slice_out*>(
        GetColumn(ColumnIndex::slice_out));
  }
  TypedColumn<SliceTable::Id>* mutable_slice_in() {
    return static_cast<ColumnType::slice_in*>(
        GetColumn(ColumnIndex::slice_in));
  }
  TypedColumn<std::optional<int64_t>>* mutable_trace_id() {
    return static_cast<ColumnType::trace_id*>(
        GetColumn(ColumnIndex::trace_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<SliceTable::Id>* mutable_start_id() {
    return static_cast<ColumnType::start_id*>(
        GetColumn(ColumnIndex::start_id));
  }

 private:
  ConnectedFlowTable(StringPool* pool,
            const FlowTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::start_id::stored_type> start_id)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(start_id.size() == parent_overlay.size());
    start_id_ = std::move(start_id);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::slice_out],const_parent_->storage_layers()[ColumnIndex::slice_in],const_parent_->storage_layers()[ColumnIndex::trace_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],start_id_storage_layer_}, {{},{},{},const_parent_->null_layers()[ColumnIndex::trace_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],{}}, std::move(overlay_layers));
  }
  FlowTable* parent_ = nullptr;
  const FlowTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::start_id::stored_type> start_id_;

  RefPtr<column::StorageLayer> start_id_storage_layer_;

  
};
  

class WinscopeArgsWithDefaultsTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 9;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t table_name = 1;
    static constexpr uint32_t base64_proto_id = 2;
    static constexpr uint32_t flat_key = 3;
    static constexpr uint32_t key = 4;
    static constexpr uint32_t int_value = 5;
    static constexpr uint32_t string_value = 6;
    static constexpr uint32_t real_value = 7;
    static constexpr uint32_t value_type = 8;
  };
  struct ColumnType {
    using id = IdColumn<WinscopeArgsWithDefaultsTable::Id>;
    using table_name = TypedColumn<StringPool::Id>;
    using base64_proto_id = TypedColumn<uint32_t>;
    using flat_key = TypedColumn<StringPool::Id>;
    using key = TypedColumn<StringPool::Id>;
    using int_value = TypedColumn<std::optional<int64_t>>;
    using string_value = TypedColumn<std::optional<StringPool::Id>>;
    using real_value = TypedColumn<std::optional<double>>;
    using value_type = TypedColumn<StringPool::Id>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(StringPool::Id in_table_name = {},
        uint32_t in_base64_proto_id = {},
        StringPool::Id in_flat_key = {},
        StringPool::Id in_key = {},
        std::optional<int64_t> in_int_value = {},
        std::optional<StringPool::Id> in_string_value = {},
        std::optional<double> in_real_value = {},
        StringPool::Id in_value_type = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          table_name(in_table_name),
          base64_proto_id(in_base64_proto_id),
          flat_key(in_flat_key),
          key(in_key),
          int_value(in_int_value),
          string_value(in_string_value),
          real_value(in_real_value),
          value_type(in_value_type) {}
    StringPool::Id table_name;
    uint32_t base64_proto_id;
    StringPool::Id flat_key;
    StringPool::Id key;
    std::optional<int64_t> int_value;
    std::optional<StringPool::Id> string_value;
    std::optional<double> real_value;
    StringPool::Id value_type;

    bool operator==(const WinscopeArgsWithDefaultsTable::Row& other) const {
      return ColumnType::table_name::Equals(table_name, other.table_name) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id) &&
       ColumnType::flat_key::Equals(flat_key, other.flat_key) &&
       ColumnType::key::Equals(key, other.key) &&
       ColumnType::int_value::Equals(int_value, other.int_value) &&
       ColumnType::string_value::Equals(string_value, other.string_value) &&
       ColumnType::real_value::Equals(real_value, other.real_value) &&
       ColumnType::value_type::Equals(value_type, other.value_type);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t table_name = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::table_name::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
    static constexpr uint32_t flat_key = ColumnType::flat_key::default_flags();
    static constexpr uint32_t key = ColumnType::key::default_flags();
    static constexpr uint32_t int_value = ColumnType::int_value::default_flags();
    static constexpr uint32_t string_value = ColumnType::string_value::default_flags();
    static constexpr uint32_t real_value = ColumnType::real_value::default_flags();
    static constexpr uint32_t value_type = ColumnType::value_type::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      WinscopeArgsWithDefaultsTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    WinscopeArgsWithDefaultsTable, RowNumber> {
   public:
    ConstRowReference(const WinscopeArgsWithDefaultsTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::table_name::type table_name() const {
      return table()->table_name()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
    ColumnType::flat_key::type flat_key() const {
      return table()->flat_key()[row_number_];
    }
    ColumnType::key::type key() const {
      return table()->key()[row_number_];
    }
    ColumnType::int_value::type int_value() const {
      return table()->int_value()[row_number_];
    }
    ColumnType::string_value::type string_value() const {
      return table()->string_value()[row_number_];
    }
    ColumnType::real_value::type real_value() const {
      return table()->real_value()[row_number_];
    }
    ColumnType::value_type::type value_type() const {
      return table()->value_type()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const WinscopeArgsWithDefaultsTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_table_name(
        ColumnType::table_name::non_optional_type v) {
      return mutable_table()->mutable_table_name()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }
    void set_flat_key(
        ColumnType::flat_key::non_optional_type v) {
      return mutable_table()->mutable_flat_key()->Set(row_number_, v);
    }
    void set_key(
        ColumnType::key::non_optional_type v) {
      return mutable_table()->mutable_key()->Set(row_number_, v);
    }
    void set_int_value(
        ColumnType::int_value::non_optional_type v) {
      return mutable_table()->mutable_int_value()->Set(row_number_, v);
    }
    void set_string_value(
        ColumnType::string_value::non_optional_type v) {
      return mutable_table()->mutable_string_value()->Set(row_number_, v);
    }
    void set_real_value(
        ColumnType::real_value::non_optional_type v) {
      return mutable_table()->mutable_real_value()->Set(row_number_, v);
    }
    void set_value_type(
        ColumnType::value_type::non_optional_type v) {
      return mutable_table()->mutable_value_type()->Set(row_number_, v);
    }

   private:
    WinscopeArgsWithDefaultsTable* mutable_table() const {
      return const_cast<WinscopeArgsWithDefaultsTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, WinscopeArgsWithDefaultsTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::table_name::type table_name() const {
      const auto& col = table()->table_name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::flat_key::type flat_key() const {
      const auto& col = table()->flat_key();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::key::type key() const {
      const auto& col = table()->key();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::int_value::type int_value() const {
      const auto& col = table()->int_value();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::string_value::type string_value() const {
      const auto& col = table()->string_value();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::real_value::type real_value() const {
      const auto& col = table()->real_value();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::value_type::type value_type() const {
      const auto& col = table()->value_type();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const WinscopeArgsWithDefaultsTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class WinscopeArgsWithDefaultsTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, WinscopeArgsWithDefaultsTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<WinscopeArgsWithDefaultsTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class WinscopeArgsWithDefaultsTable;

     explicit Iterator(WinscopeArgsWithDefaultsTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      WinscopeArgsWithDefaultsTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "table_name", &self->table_name_, ColumnFlag::table_name,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "flat_key", &self->flat_key_, ColumnFlag::flat_key,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "key", &self->key_, ColumnFlag::key,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "int_value", &self->int_value_, ColumnFlag::int_value,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "string_value", &self->string_value_, ColumnFlag::string_value,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "real_value", &self->real_value_, ColumnFlag::real_value,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "value_type", &self->value_type_, ColumnFlag::value_type,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit WinscopeArgsWithDefaultsTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        table_name_(ColumnStorage<ColumnType::table_name::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>()),
        flat_key_(ColumnStorage<ColumnType::flat_key::stored_type>::Create<false>()),
        key_(ColumnStorage<ColumnType::key::stored_type>::Create<false>()),
        int_value_(ColumnStorage<ColumnType::int_value::stored_type>::Create<false>()),
        string_value_(ColumnStorage<ColumnType::string_value::stored_type>::Create<false>()),
        real_value_(ColumnStorage<ColumnType::real_value::stored_type>::Create<false>()),
        value_type_(ColumnStorage<ColumnType::value_type::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        table_name_storage_layer_(
          new column::StringStorage(string_pool(), &table_name_.vector())),
        base64_proto_id_storage_layer_(
        new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
          &base64_proto_id_.vector(),
          ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
          false)),
        flat_key_storage_layer_(
          new column::StringStorage(string_pool(), &flat_key_.vector())),
        key_storage_layer_(
          new column::StringStorage(string_pool(), &key_.vector())),
        int_value_storage_layer_(
          new column::NumericStorage<ColumnType::int_value::non_optional_stored_type>(
            &int_value_.non_null_vector(),
            ColumnTypeHelper<ColumnType::int_value::stored_type>::ToColumnType(),
            false)),
        string_value_storage_layer_(
          new column::StringStorage(string_pool(), &string_value_.vector())),
        real_value_storage_layer_(
          new column::NumericStorage<ColumnType::real_value::non_optional_stored_type>(
            &real_value_.non_null_vector(),
            ColumnTypeHelper<ColumnType::real_value::stored_type>::ToColumnType(),
            false)),
        value_type_storage_layer_(
          new column::StringStorage(string_pool(), &value_type_.vector()))
,
        int_value_null_layer_(new column::NullOverlay(int_value_.bv())),
        real_value_null_layer_(new column::NullOverlay(real_value_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::table_name::stored_type>(
          ColumnFlag::table_name),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::flat_key::stored_type>(
          ColumnFlag::flat_key),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::key::stored_type>(
          ColumnFlag::key),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::int_value::stored_type>(
          ColumnFlag::int_value),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::string_value::stored_type>(
          ColumnFlag::string_value),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::real_value::stored_type>(
          ColumnFlag::real_value),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::value_type::stored_type>(
          ColumnFlag::value_type),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,table_name_storage_layer_,base64_proto_id_storage_layer_,flat_key_storage_layer_,key_storage_layer_,int_value_storage_layer_,string_value_storage_layer_,real_value_storage_layer_,value_type_storage_layer_},
      {{},{},{},{},{},int_value_null_layer_,{},real_value_null_layer_,{}});
  }
  ~WinscopeArgsWithDefaultsTable() override;

  static const char* Name() { return "__intrinsic_winscope_proto_to_args_with_defaults"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "table_name", ColumnType::table_name::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "flat_key", ColumnType::flat_key::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "key", ColumnType::key::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "int_value", ColumnType::int_value::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "string_value", ColumnType::string_value::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "real_value", ColumnType::real_value::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "value_type", ColumnType::value_type::SqlValueType(), false,
        false,
        false,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    table_name_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
    flat_key_.ShrinkToFit();
    key_.ShrinkToFit();
    int_value_.ShrinkToFit();
    string_value_.ShrinkToFit();
    real_value_.ShrinkToFit();
    value_type_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{row_number};
    mutable_table_name()->Append(row.table_name);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    mutable_flat_key()->Append(row.flat_key);
    mutable_key()->Append(row.key);
    mutable_int_value()->Append(row.int_value);
    mutable_string_value()->Append(row.string_value);
    mutable_real_value()->Append(row.real_value);
    mutable_value_type()->Append(row.value_type);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<WinscopeArgsWithDefaultsTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<StringPool::Id>& table_name() const {
    return static_cast<const ColumnType::table_name&>(columns()[ColumnIndex::table_name]);
  }
  const TypedColumn<uint32_t>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }
  const TypedColumn<StringPool::Id>& flat_key() const {
    return static_cast<const ColumnType::flat_key&>(columns()[ColumnIndex::flat_key]);
  }
  const TypedColumn<StringPool::Id>& key() const {
    return static_cast<const ColumnType::key&>(columns()[ColumnIndex::key]);
  }
  const TypedColumn<std::optional<int64_t>>& int_value() const {
    return static_cast<const ColumnType::int_value&>(columns()[ColumnIndex::int_value]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& string_value() const {
    return static_cast<const ColumnType::string_value&>(columns()[ColumnIndex::string_value]);
  }
  const TypedColumn<std::optional<double>>& real_value() const {
    return static_cast<const ColumnType::real_value&>(columns()[ColumnIndex::real_value]);
  }
  const TypedColumn<StringPool::Id>& value_type() const {
    return static_cast<const ColumnType::value_type&>(columns()[ColumnIndex::value_type]);
  }

  TypedColumn<StringPool::Id>* mutable_table_name() {
    return static_cast<ColumnType::table_name*>(
        GetColumn(ColumnIndex::table_name));
  }
  TypedColumn<uint32_t>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }
  TypedColumn<StringPool::Id>* mutable_flat_key() {
    return static_cast<ColumnType::flat_key*>(
        GetColumn(ColumnIndex::flat_key));
  }
  TypedColumn<StringPool::Id>* mutable_key() {
    return static_cast<ColumnType::key*>(
        GetColumn(ColumnIndex::key));
  }
  TypedColumn<std::optional<int64_t>>* mutable_int_value() {
    return static_cast<ColumnType::int_value*>(
        GetColumn(ColumnIndex::int_value));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_string_value() {
    return static_cast<ColumnType::string_value*>(
        GetColumn(ColumnIndex::string_value));
  }
  TypedColumn<std::optional<double>>* mutable_real_value() {
    return static_cast<ColumnType::real_value*>(
        GetColumn(ColumnIndex::real_value));
  }
  TypedColumn<StringPool::Id>* mutable_value_type() {
    return static_cast<ColumnType::value_type*>(
        GetColumn(ColumnIndex::value_type));
  }

 private:
  
  
  ColumnStorage<ColumnType::table_name::stored_type> table_name_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;
  ColumnStorage<ColumnType::flat_key::stored_type> flat_key_;
  ColumnStorage<ColumnType::key::stored_type> key_;
  ColumnStorage<ColumnType::int_value::stored_type> int_value_;
  ColumnStorage<ColumnType::string_value::stored_type> string_value_;
  ColumnStorage<ColumnType::real_value::stored_type> real_value_;
  ColumnStorage<ColumnType::value_type::stored_type> value_type_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> table_name_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;
  RefPtr<column::StorageLayer> flat_key_storage_layer_;
  RefPtr<column::StorageLayer> key_storage_layer_;
  RefPtr<column::StorageLayer> int_value_storage_layer_;
  RefPtr<column::StorageLayer> string_value_storage_layer_;
  RefPtr<column::StorageLayer> real_value_storage_layer_;
  RefPtr<column::StorageLayer> value_type_storage_layer_;

  RefPtr<column::OverlayLayer> int_value_null_layer_;
  RefPtr<column::OverlayLayer> real_value_null_layer_;
};
  

class DescendantSliceByStackTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 16;

  using Id = SliceTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
    static constexpr uint32_t start_stack_id = 15;
  };
  struct ColumnType {
    using id = IdColumn<DescendantSliceByStackTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using depth = TypedColumn<uint32_t>;
    using stack_id = TypedColumn<int64_t>;
    using parent_stack_id = TypedColumn<int64_t>;
    using parent_id = TypedColumn<std::optional<DescendantSliceByStackTable::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using thread_ts = TypedColumn<std::optional<int64_t>>;
    using thread_dur = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_count = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_delta = TypedColumn<std::optional<int64_t>>;
    using start_stack_id = TypedColumn<int64_t>;
  };
  struct Row : public SliceTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        uint32_t in_depth = {},
        int64_t in_stack_id = {},
        int64_t in_parent_stack_id = {},
        std::optional<DescendantSliceByStackTable::Id> in_parent_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<int64_t> in_thread_ts = {},
        std::optional<int64_t> in_thread_dur = {},
        std::optional<int64_t> in_thread_instruction_count = {},
        std::optional<int64_t> in_thread_instruction_delta = {},
        int64_t in_start_stack_id = {},
        std::nullptr_t = nullptr)
        : SliceTable::Row(in_ts, in_dur, in_track_id, in_category, in_name, in_depth, in_stack_id, in_parent_stack_id, in_parent_id, in_arg_set_id, in_thread_ts, in_thread_dur, in_thread_instruction_count, in_thread_instruction_delta),
          start_stack_id(in_start_stack_id) {}
    int64_t start_stack_id;

    bool operator==(const DescendantSliceByStackTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::stack_id::Equals(stack_id, other.stack_id) &&
       ColumnType::parent_stack_id::Equals(parent_stack_id, other.parent_stack_id) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::thread_ts::Equals(thread_ts, other.thread_ts) &&
       ColumnType::thread_dur::Equals(thread_dur, other.thread_dur) &&
       ColumnType::thread_instruction_count::Equals(thread_instruction_count, other.thread_instruction_count) &&
       ColumnType::thread_instruction_delta::Equals(thread_instruction_delta, other.thread_instruction_delta) &&
       ColumnType::start_stack_id::Equals(start_stack_id, other.start_stack_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t start_stack_id = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_stack_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      DescendantSliceByStackTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    DescendantSliceByStackTable, RowNumber> {
   public:
    ConstRowReference(const DescendantSliceByStackTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::stack_id::type stack_id() const {
      return table()->stack_id()[row_number_];
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      return table()->parent_stack_id()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::thread_ts::type thread_ts() const {
      return table()->thread_ts()[row_number_];
    }
    ColumnType::thread_dur::type thread_dur() const {
      return table()->thread_dur()[row_number_];
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      return table()->thread_instruction_count()[row_number_];
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      return table()->thread_instruction_delta()[row_number_];
    }
    ColumnType::start_stack_id::type start_stack_id() const {
      return table()->start_stack_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const DescendantSliceByStackTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_stack_id(
        ColumnType::stack_id::non_optional_type v) {
      return mutable_table()->mutable_stack_id()->Set(row_number_, v);
    }
    void set_parent_stack_id(
        ColumnType::parent_stack_id::non_optional_type v) {
      return mutable_table()->mutable_parent_stack_id()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_thread_ts(
        ColumnType::thread_ts::non_optional_type v) {
      return mutable_table()->mutable_thread_ts()->Set(row_number_, v);
    }
    void set_thread_dur(
        ColumnType::thread_dur::non_optional_type v) {
      return mutable_table()->mutable_thread_dur()->Set(row_number_, v);
    }
    void set_thread_instruction_count(
        ColumnType::thread_instruction_count::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_count()->Set(row_number_, v);
    }
    void set_thread_instruction_delta(
        ColumnType::thread_instruction_delta::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_delta()->Set(row_number_, v);
    }
    void set_start_stack_id(
        ColumnType::start_stack_id::non_optional_type v) {
      return mutable_table()->mutable_start_stack_id()->Set(row_number_, v);
    }

   private:
    DescendantSliceByStackTable* mutable_table() const {
      return const_cast<DescendantSliceByStackTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, DescendantSliceByStackTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stack_id::type stack_id() const {
      const auto& col = table()->stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      const auto& col = table()->parent_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_ts::type thread_ts() const {
      const auto& col = table()->thread_ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_dur::type thread_dur() const {
      const auto& col = table()->thread_dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      const auto& col = table()->thread_instruction_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      const auto& col = table()->thread_instruction_delta();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_stack_id::type start_stack_id() const {
      const auto& col = table()->start_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const DescendantSliceByStackTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class DescendantSliceByStackTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, DescendantSliceByStackTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<DescendantSliceByStackTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class DescendantSliceByStackTable;

     explicit Iterator(DescendantSliceByStackTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      DescendantSliceByStackTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "start_stack_id", &self->start_stack_id_, ColumnFlag::start_stack_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit DescendantSliceByStackTable(StringPool* pool, SliceTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), start_stack_id_(ColumnStorage<ColumnType::start_stack_id::stored_type>::Create<false>())
,
        start_stack_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_stack_id::non_optional_stored_type>(
          &start_stack_id_.vector(),
          ColumnTypeHelper<ColumnType::start_stack_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_stack_id::stored_type>(
          ColumnFlag::start_stack_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_stack_id_storage_layer_},
      {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}});
  }
  ~DescendantSliceByStackTable() override;

  static const char* Name() { return "descendant_slice_by_stack"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stack_id", ColumnType::stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_stack_id", ColumnType::parent_stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_ts", ColumnType::thread_ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_dur", ColumnType::thread_dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_count", ColumnType::thread_instruction_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_delta", ColumnType::thread_instruction_delta::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_stack_id", ColumnType::start_stack_id::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    start_stack_id_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_start_stack_id()->Append(row.start_stack_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<DescendantSliceByStackTable> ExtendParent(
      const SliceTable& parent,
      ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id) {
    return std::unique_ptr<DescendantSliceByStackTable>(new DescendantSliceByStackTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(start_stack_id)));
  }

  static std::unique_ptr<DescendantSliceByStackTable> SelectAndExtendParent(
      const SliceTable& parent,
      std::vector<SliceTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<DescendantSliceByStackTable>(new DescendantSliceByStackTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(start_stack_id)));
  }

  const IdColumn<DescendantSliceByStackTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<int64_t>& stack_id() const {
    return static_cast<const ColumnType::stack_id&>(columns()[ColumnIndex::stack_id]);
  }
  const TypedColumn<int64_t>& parent_stack_id() const {
    return static_cast<const ColumnType::parent_stack_id&>(columns()[ColumnIndex::parent_stack_id]);
  }
  const TypedColumn<std::optional<DescendantSliceByStackTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_ts() const {
    return static_cast<const ColumnType::thread_ts&>(columns()[ColumnIndex::thread_ts]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_dur() const {
    return static_cast<const ColumnType::thread_dur&>(columns()[ColumnIndex::thread_dur]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_count() const {
    return static_cast<const ColumnType::thread_instruction_count&>(columns()[ColumnIndex::thread_instruction_count]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_delta() const {
    return static_cast<const ColumnType::thread_instruction_delta&>(columns()[ColumnIndex::thread_instruction_delta]);
  }
  const TypedColumn<int64_t>& start_stack_id() const {
    return static_cast<const ColumnType::start_stack_id&>(columns()[ColumnIndex::start_stack_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<int64_t>* mutable_stack_id() {
    return static_cast<ColumnType::stack_id*>(
        GetColumn(ColumnIndex::stack_id));
  }
  TypedColumn<int64_t>* mutable_parent_stack_id() {
    return static_cast<ColumnType::parent_stack_id*>(
        GetColumn(ColumnIndex::parent_stack_id));
  }
  TypedColumn<std::optional<DescendantSliceByStackTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_ts() {
    return static_cast<ColumnType::thread_ts*>(
        GetColumn(ColumnIndex::thread_ts));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_dur() {
    return static_cast<ColumnType::thread_dur*>(
        GetColumn(ColumnIndex::thread_dur));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_count() {
    return static_cast<ColumnType::thread_instruction_count*>(
        GetColumn(ColumnIndex::thread_instruction_count));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_delta() {
    return static_cast<ColumnType::thread_instruction_delta*>(
        GetColumn(ColumnIndex::thread_instruction_delta));
  }
  TypedColumn<int64_t>* mutable_start_stack_id() {
    return static_cast<ColumnType::start_stack_id*>(
        GetColumn(ColumnIndex::start_stack_id));
  }

 private:
  DescendantSliceByStackTable(StringPool* pool,
            const SliceTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        start_stack_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_stack_id::non_optional_stored_type>(
          &start_stack_id_.vector(),
          ColumnTypeHelper<ColumnType::start_stack_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_stack_id::stored_type>(
          ColumnFlag::start_stack_id),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(start_stack_id.size() == parent_overlay.size());
    start_stack_id_ = std::move(start_stack_id);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_stack_id_storage_layer_}, {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}}, std::move(overlay_layers));
  }
  SliceTable* parent_ = nullptr;
  const SliceTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::start_stack_id::stored_type> start_stack_id_;

  RefPtr<column::StorageLayer> start_stack_id_storage_layer_;

  
};
  

class DescendantSliceTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 16;

  using Id = SliceTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
    static constexpr uint32_t start_id = 15;
  };
  struct ColumnType {
    using id = IdColumn<DescendantSliceTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using depth = TypedColumn<uint32_t>;
    using stack_id = TypedColumn<int64_t>;
    using parent_stack_id = TypedColumn<int64_t>;
    using parent_id = TypedColumn<std::optional<DescendantSliceTable::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using thread_ts = TypedColumn<std::optional<int64_t>>;
    using thread_dur = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_count = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_delta = TypedColumn<std::optional<int64_t>>;
    using start_id = TypedColumn<SliceTable::Id>;
  };
  struct Row : public SliceTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        uint32_t in_depth = {},
        int64_t in_stack_id = {},
        int64_t in_parent_stack_id = {},
        std::optional<DescendantSliceTable::Id> in_parent_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<int64_t> in_thread_ts = {},
        std::optional<int64_t> in_thread_dur = {},
        std::optional<int64_t> in_thread_instruction_count = {},
        std::optional<int64_t> in_thread_instruction_delta = {},
        SliceTable::Id in_start_id = {},
        std::nullptr_t = nullptr)
        : SliceTable::Row(in_ts, in_dur, in_track_id, in_category, in_name, in_depth, in_stack_id, in_parent_stack_id, in_parent_id, in_arg_set_id, in_thread_ts, in_thread_dur, in_thread_instruction_count, in_thread_instruction_delta),
          start_id(in_start_id) {}
    SliceTable::Id start_id;

    bool operator==(const DescendantSliceTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::stack_id::Equals(stack_id, other.stack_id) &&
       ColumnType::parent_stack_id::Equals(parent_stack_id, other.parent_stack_id) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::thread_ts::Equals(thread_ts, other.thread_ts) &&
       ColumnType::thread_dur::Equals(thread_dur, other.thread_dur) &&
       ColumnType::thread_instruction_count::Equals(thread_instruction_count, other.thread_instruction_count) &&
       ColumnType::thread_instruction_delta::Equals(thread_instruction_delta, other.thread_instruction_delta) &&
       ColumnType::start_id::Equals(start_id, other.start_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t start_id = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      DescendantSliceTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    DescendantSliceTable, RowNumber> {
   public:
    ConstRowReference(const DescendantSliceTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::stack_id::type stack_id() const {
      return table()->stack_id()[row_number_];
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      return table()->parent_stack_id()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::thread_ts::type thread_ts() const {
      return table()->thread_ts()[row_number_];
    }
    ColumnType::thread_dur::type thread_dur() const {
      return table()->thread_dur()[row_number_];
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      return table()->thread_instruction_count()[row_number_];
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      return table()->thread_instruction_delta()[row_number_];
    }
    ColumnType::start_id::type start_id() const {
      return table()->start_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const DescendantSliceTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_stack_id(
        ColumnType::stack_id::non_optional_type v) {
      return mutable_table()->mutable_stack_id()->Set(row_number_, v);
    }
    void set_parent_stack_id(
        ColumnType::parent_stack_id::non_optional_type v) {
      return mutable_table()->mutable_parent_stack_id()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_thread_ts(
        ColumnType::thread_ts::non_optional_type v) {
      return mutable_table()->mutable_thread_ts()->Set(row_number_, v);
    }
    void set_thread_dur(
        ColumnType::thread_dur::non_optional_type v) {
      return mutable_table()->mutable_thread_dur()->Set(row_number_, v);
    }
    void set_thread_instruction_count(
        ColumnType::thread_instruction_count::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_count()->Set(row_number_, v);
    }
    void set_thread_instruction_delta(
        ColumnType::thread_instruction_delta::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_delta()->Set(row_number_, v);
    }
    void set_start_id(
        ColumnType::start_id::non_optional_type v) {
      return mutable_table()->mutable_start_id()->Set(row_number_, v);
    }

   private:
    DescendantSliceTable* mutable_table() const {
      return const_cast<DescendantSliceTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, DescendantSliceTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stack_id::type stack_id() const {
      const auto& col = table()->stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      const auto& col = table()->parent_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_ts::type thread_ts() const {
      const auto& col = table()->thread_ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_dur::type thread_dur() const {
      const auto& col = table()->thread_dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      const auto& col = table()->thread_instruction_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      const auto& col = table()->thread_instruction_delta();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_id::type start_id() const {
      const auto& col = table()->start_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const DescendantSliceTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class DescendantSliceTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, DescendantSliceTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<DescendantSliceTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class DescendantSliceTable;

     explicit Iterator(DescendantSliceTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      DescendantSliceTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "start_id", &self->start_id_, ColumnFlag::start_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit DescendantSliceTable(StringPool* pool, SliceTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), start_id_(ColumnStorage<ColumnType::start_id::stored_type>::Create<false>())
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_id_storage_layer_},
      {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}});
  }
  ~DescendantSliceTable() override;

  static const char* Name() { return "descendant_slice"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stack_id", ColumnType::stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_stack_id", ColumnType::parent_stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_ts", ColumnType::thread_ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_dur", ColumnType::thread_dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_count", ColumnType::thread_instruction_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_delta", ColumnType::thread_instruction_delta::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_id", ColumnType::start_id::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    start_id_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_start_id()->Append(row.start_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<DescendantSliceTable> ExtendParent(
      const SliceTable& parent,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    return std::unique_ptr<DescendantSliceTable>(new DescendantSliceTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(start_id)));
  }

  static std::unique_ptr<DescendantSliceTable> SelectAndExtendParent(
      const SliceTable& parent,
      std::vector<SliceTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<DescendantSliceTable>(new DescendantSliceTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(start_id)));
  }

  const IdColumn<DescendantSliceTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<int64_t>& stack_id() const {
    return static_cast<const ColumnType::stack_id&>(columns()[ColumnIndex::stack_id]);
  }
  const TypedColumn<int64_t>& parent_stack_id() const {
    return static_cast<const ColumnType::parent_stack_id&>(columns()[ColumnIndex::parent_stack_id]);
  }
  const TypedColumn<std::optional<DescendantSliceTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_ts() const {
    return static_cast<const ColumnType::thread_ts&>(columns()[ColumnIndex::thread_ts]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_dur() const {
    return static_cast<const ColumnType::thread_dur&>(columns()[ColumnIndex::thread_dur]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_count() const {
    return static_cast<const ColumnType::thread_instruction_count&>(columns()[ColumnIndex::thread_instruction_count]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_delta() const {
    return static_cast<const ColumnType::thread_instruction_delta&>(columns()[ColumnIndex::thread_instruction_delta]);
  }
  const TypedColumn<SliceTable::Id>& start_id() const {
    return static_cast<const ColumnType::start_id&>(columns()[ColumnIndex::start_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<int64_t>* mutable_stack_id() {
    return static_cast<ColumnType::stack_id*>(
        GetColumn(ColumnIndex::stack_id));
  }
  TypedColumn<int64_t>* mutable_parent_stack_id() {
    return static_cast<ColumnType::parent_stack_id*>(
        GetColumn(ColumnIndex::parent_stack_id));
  }
  TypedColumn<std::optional<DescendantSliceTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_ts() {
    return static_cast<ColumnType::thread_ts*>(
        GetColumn(ColumnIndex::thread_ts));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_dur() {
    return static_cast<ColumnType::thread_dur*>(
        GetColumn(ColumnIndex::thread_dur));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_count() {
    return static_cast<ColumnType::thread_instruction_count*>(
        GetColumn(ColumnIndex::thread_instruction_count));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_delta() {
    return static_cast<ColumnType::thread_instruction_delta*>(
        GetColumn(ColumnIndex::thread_instruction_delta));
  }
  TypedColumn<SliceTable::Id>* mutable_start_id() {
    return static_cast<ColumnType::start_id*>(
        GetColumn(ColumnIndex::start_id));
  }

 private:
  DescendantSliceTable(StringPool* pool,
            const SliceTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::start_id::stored_type> start_id)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(start_id.size() == parent_overlay.size());
    start_id_ = std::move(start_id);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],start_id_storage_layer_}, {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{}}, std::move(overlay_layers));
  }
  SliceTable* parent_ = nullptr;
  const SliceTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::start_id::stored_type> start_id_;

  RefPtr<column::StorageLayer> start_id_storage_layer_;

  
};
  

class DfsWeightBoundedTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 10;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t root_node_id = 1;
    static constexpr uint32_t node_id = 2;
    static constexpr uint32_t parent_node_id = 3;
    static constexpr uint32_t in_source_node_ids = 4;
    static constexpr uint32_t in_dest_node_ids = 5;
    static constexpr uint32_t in_edge_weights = 6;
    static constexpr uint32_t in_root_node_ids = 7;
    static constexpr uint32_t in_root_max_weights = 8;
    static constexpr uint32_t in_is_target_weight_floor = 9;
  };
  struct ColumnType {
    using id = IdColumn<DfsWeightBoundedTable::Id>;
    using root_node_id = TypedColumn<uint32_t>;
    using node_id = TypedColumn<uint32_t>;
    using parent_node_id = TypedColumn<std::optional<uint32_t>>;
    using in_source_node_ids = TypedColumn<std::optional<uint32_t>>;
    using in_dest_node_ids = TypedColumn<std::optional<uint32_t>>;
    using in_edge_weights = TypedColumn<std::optional<uint32_t>>;
    using in_root_node_ids = TypedColumn<std::optional<uint32_t>>;
    using in_root_max_weights = TypedColumn<std::optional<uint32_t>>;
    using in_is_target_weight_floor = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(uint32_t in_root_node_id = {},
        uint32_t in_node_id = {},
        std::optional<uint32_t> in_parent_node_id = {},
        std::optional<uint32_t> in_in_source_node_ids = {},
        std::optional<uint32_t> in_in_dest_node_ids = {},
        std::optional<uint32_t> in_in_edge_weights = {},
        std::optional<uint32_t> in_in_root_node_ids = {},
        std::optional<uint32_t> in_in_root_max_weights = {},
        std::optional<uint32_t> in_in_is_target_weight_floor = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          root_node_id(in_root_node_id),
          node_id(in_node_id),
          parent_node_id(in_parent_node_id),
          in_source_node_ids(in_in_source_node_ids),
          in_dest_node_ids(in_in_dest_node_ids),
          in_edge_weights(in_in_edge_weights),
          in_root_node_ids(in_in_root_node_ids),
          in_root_max_weights(in_in_root_max_weights),
          in_is_target_weight_floor(in_in_is_target_weight_floor) {}
    uint32_t root_node_id;
    uint32_t node_id;
    std::optional<uint32_t> parent_node_id;
    std::optional<uint32_t> in_source_node_ids;
    std::optional<uint32_t> in_dest_node_ids;
    std::optional<uint32_t> in_edge_weights;
    std::optional<uint32_t> in_root_node_ids;
    std::optional<uint32_t> in_root_max_weights;
    std::optional<uint32_t> in_is_target_weight_floor;

    bool operator==(const DfsWeightBoundedTable::Row& other) const {
      return ColumnType::root_node_id::Equals(root_node_id, other.root_node_id) &&
       ColumnType::node_id::Equals(node_id, other.node_id) &&
       ColumnType::parent_node_id::Equals(parent_node_id, other.parent_node_id) &&
       ColumnType::in_source_node_ids::Equals(in_source_node_ids, other.in_source_node_ids) &&
       ColumnType::in_dest_node_ids::Equals(in_dest_node_ids, other.in_dest_node_ids) &&
       ColumnType::in_edge_weights::Equals(in_edge_weights, other.in_edge_weights) &&
       ColumnType::in_root_node_ids::Equals(in_root_node_ids, other.in_root_node_ids) &&
       ColumnType::in_root_max_weights::Equals(in_root_max_weights, other.in_root_max_weights) &&
       ColumnType::in_is_target_weight_floor::Equals(in_is_target_weight_floor, other.in_is_target_weight_floor);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t root_node_id = ColumnType::root_node_id::default_flags();
    static constexpr uint32_t node_id = ColumnType::node_id::default_flags();
    static constexpr uint32_t parent_node_id = ColumnType::parent_node_id::default_flags();
    static constexpr uint32_t in_source_node_ids = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::in_source_node_ids::default_flags();
    static constexpr uint32_t in_dest_node_ids = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::in_dest_node_ids::default_flags();
    static constexpr uint32_t in_edge_weights = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::in_edge_weights::default_flags();
    static constexpr uint32_t in_root_node_ids = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::in_root_node_ids::default_flags();
    static constexpr uint32_t in_root_max_weights = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::in_root_max_weights::default_flags();
    static constexpr uint32_t in_is_target_weight_floor = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::in_is_target_weight_floor::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      DfsWeightBoundedTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    DfsWeightBoundedTable, RowNumber> {
   public:
    ConstRowReference(const DfsWeightBoundedTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::root_node_id::type root_node_id() const {
      return table()->root_node_id()[row_number_];
    }
    ColumnType::node_id::type node_id() const {
      return table()->node_id()[row_number_];
    }
    ColumnType::parent_node_id::type parent_node_id() const {
      return table()->parent_node_id()[row_number_];
    }
    ColumnType::in_source_node_ids::type in_source_node_ids() const {
      return table()->in_source_node_ids()[row_number_];
    }
    ColumnType::in_dest_node_ids::type in_dest_node_ids() const {
      return table()->in_dest_node_ids()[row_number_];
    }
    ColumnType::in_edge_weights::type in_edge_weights() const {
      return table()->in_edge_weights()[row_number_];
    }
    ColumnType::in_root_node_ids::type in_root_node_ids() const {
      return table()->in_root_node_ids()[row_number_];
    }
    ColumnType::in_root_max_weights::type in_root_max_weights() const {
      return table()->in_root_max_weights()[row_number_];
    }
    ColumnType::in_is_target_weight_floor::type in_is_target_weight_floor() const {
      return table()->in_is_target_weight_floor()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const DfsWeightBoundedTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_root_node_id(
        ColumnType::root_node_id::non_optional_type v) {
      return mutable_table()->mutable_root_node_id()->Set(row_number_, v);
    }
    void set_node_id(
        ColumnType::node_id::non_optional_type v) {
      return mutable_table()->mutable_node_id()->Set(row_number_, v);
    }
    void set_parent_node_id(
        ColumnType::parent_node_id::non_optional_type v) {
      return mutable_table()->mutable_parent_node_id()->Set(row_number_, v);
    }
    void set_in_source_node_ids(
        ColumnType::in_source_node_ids::non_optional_type v) {
      return mutable_table()->mutable_in_source_node_ids()->Set(row_number_, v);
    }
    void set_in_dest_node_ids(
        ColumnType::in_dest_node_ids::non_optional_type v) {
      return mutable_table()->mutable_in_dest_node_ids()->Set(row_number_, v);
    }
    void set_in_edge_weights(
        ColumnType::in_edge_weights::non_optional_type v) {
      return mutable_table()->mutable_in_edge_weights()->Set(row_number_, v);
    }
    void set_in_root_node_ids(
        ColumnType::in_root_node_ids::non_optional_type v) {
      return mutable_table()->mutable_in_root_node_ids()->Set(row_number_, v);
    }
    void set_in_root_max_weights(
        ColumnType::in_root_max_weights::non_optional_type v) {
      return mutable_table()->mutable_in_root_max_weights()->Set(row_number_, v);
    }
    void set_in_is_target_weight_floor(
        ColumnType::in_is_target_weight_floor::non_optional_type v) {
      return mutable_table()->mutable_in_is_target_weight_floor()->Set(row_number_, v);
    }

   private:
    DfsWeightBoundedTable* mutable_table() const {
      return const_cast<DfsWeightBoundedTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, DfsWeightBoundedTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::root_node_id::type root_node_id() const {
      const auto& col = table()->root_node_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::node_id::type node_id() const {
      const auto& col = table()->node_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_node_id::type parent_node_id() const {
      const auto& col = table()->parent_node_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::in_source_node_ids::type in_source_node_ids() const {
      const auto& col = table()->in_source_node_ids();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::in_dest_node_ids::type in_dest_node_ids() const {
      const auto& col = table()->in_dest_node_ids();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::in_edge_weights::type in_edge_weights() const {
      const auto& col = table()->in_edge_weights();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::in_root_node_ids::type in_root_node_ids() const {
      const auto& col = table()->in_root_node_ids();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::in_root_max_weights::type in_root_max_weights() const {
      const auto& col = table()->in_root_max_weights();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::in_is_target_weight_floor::type in_is_target_weight_floor() const {
      const auto& col = table()->in_is_target_weight_floor();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const DfsWeightBoundedTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class DfsWeightBoundedTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, DfsWeightBoundedTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<DfsWeightBoundedTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class DfsWeightBoundedTable;

     explicit Iterator(DfsWeightBoundedTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      DfsWeightBoundedTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "root_node_id", &self->root_node_id_, ColumnFlag::root_node_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "node_id", &self->node_id_, ColumnFlag::node_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "parent_node_id", &self->parent_node_id_, ColumnFlag::parent_node_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "in_source_node_ids", &self->in_source_node_ids_, ColumnFlag::in_source_node_ids,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "in_dest_node_ids", &self->in_dest_node_ids_, ColumnFlag::in_dest_node_ids,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "in_edge_weights", &self->in_edge_weights_, ColumnFlag::in_edge_weights,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "in_root_node_ids", &self->in_root_node_ids_, ColumnFlag::in_root_node_ids,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "in_root_max_weights", &self->in_root_max_weights_, ColumnFlag::in_root_max_weights,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "in_is_target_weight_floor", &self->in_is_target_weight_floor_, ColumnFlag::in_is_target_weight_floor,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit DfsWeightBoundedTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        root_node_id_(ColumnStorage<ColumnType::root_node_id::stored_type>::Create<false>()),
        node_id_(ColumnStorage<ColumnType::node_id::stored_type>::Create<false>()),
        parent_node_id_(ColumnStorage<ColumnType::parent_node_id::stored_type>::Create<false>()),
        in_source_node_ids_(ColumnStorage<ColumnType::in_source_node_ids::stored_type>::Create<false>()),
        in_dest_node_ids_(ColumnStorage<ColumnType::in_dest_node_ids::stored_type>::Create<false>()),
        in_edge_weights_(ColumnStorage<ColumnType::in_edge_weights::stored_type>::Create<false>()),
        in_root_node_ids_(ColumnStorage<ColumnType::in_root_node_ids::stored_type>::Create<false>()),
        in_root_max_weights_(ColumnStorage<ColumnType::in_root_max_weights::stored_type>::Create<false>()),
        in_is_target_weight_floor_(ColumnStorage<ColumnType::in_is_target_weight_floor::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        root_node_id_storage_layer_(
        new column::NumericStorage<ColumnType::root_node_id::non_optional_stored_type>(
          &root_node_id_.vector(),
          ColumnTypeHelper<ColumnType::root_node_id::stored_type>::ToColumnType(),
          false)),
        node_id_storage_layer_(
        new column::NumericStorage<ColumnType::node_id::non_optional_stored_type>(
          &node_id_.vector(),
          ColumnTypeHelper<ColumnType::node_id::stored_type>::ToColumnType(),
          false)),
        parent_node_id_storage_layer_(
          new column::NumericStorage<ColumnType::parent_node_id::non_optional_stored_type>(
            &parent_node_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::parent_node_id::stored_type>::ToColumnType(),
            false)),
        in_source_node_ids_storage_layer_(
          new column::NumericStorage<ColumnType::in_source_node_ids::non_optional_stored_type>(
            &in_source_node_ids_.non_null_vector(),
            ColumnTypeHelper<ColumnType::in_source_node_ids::stored_type>::ToColumnType(),
            false)),
        in_dest_node_ids_storage_layer_(
          new column::NumericStorage<ColumnType::in_dest_node_ids::non_optional_stored_type>(
            &in_dest_node_ids_.non_null_vector(),
            ColumnTypeHelper<ColumnType::in_dest_node_ids::stored_type>::ToColumnType(),
            false)),
        in_edge_weights_storage_layer_(
          new column::NumericStorage<ColumnType::in_edge_weights::non_optional_stored_type>(
            &in_edge_weights_.non_null_vector(),
            ColumnTypeHelper<ColumnType::in_edge_weights::stored_type>::ToColumnType(),
            false)),
        in_root_node_ids_storage_layer_(
          new column::NumericStorage<ColumnType::in_root_node_ids::non_optional_stored_type>(
            &in_root_node_ids_.non_null_vector(),
            ColumnTypeHelper<ColumnType::in_root_node_ids::stored_type>::ToColumnType(),
            false)),
        in_root_max_weights_storage_layer_(
          new column::NumericStorage<ColumnType::in_root_max_weights::non_optional_stored_type>(
            &in_root_max_weights_.non_null_vector(),
            ColumnTypeHelper<ColumnType::in_root_max_weights::stored_type>::ToColumnType(),
            false)),
        in_is_target_weight_floor_storage_layer_(
          new column::NumericStorage<ColumnType::in_is_target_weight_floor::non_optional_stored_type>(
            &in_is_target_weight_floor_.non_null_vector(),
            ColumnTypeHelper<ColumnType::in_is_target_weight_floor::stored_type>::ToColumnType(),
            false))
,
        parent_node_id_null_layer_(new column::NullOverlay(parent_node_id_.bv())),
        in_source_node_ids_null_layer_(new column::NullOverlay(in_source_node_ids_.bv())),
        in_dest_node_ids_null_layer_(new column::NullOverlay(in_dest_node_ids_.bv())),
        in_edge_weights_null_layer_(new column::NullOverlay(in_edge_weights_.bv())),
        in_root_node_ids_null_layer_(new column::NullOverlay(in_root_node_ids_.bv())),
        in_root_max_weights_null_layer_(new column::NullOverlay(in_root_max_weights_.bv())),
        in_is_target_weight_floor_null_layer_(new column::NullOverlay(in_is_target_weight_floor_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::root_node_id::stored_type>(
          ColumnFlag::root_node_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::node_id::stored_type>(
          ColumnFlag::node_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::parent_node_id::stored_type>(
          ColumnFlag::parent_node_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::in_source_node_ids::stored_type>(
          ColumnFlag::in_source_node_ids),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::in_dest_node_ids::stored_type>(
          ColumnFlag::in_dest_node_ids),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::in_edge_weights::stored_type>(
          ColumnFlag::in_edge_weights),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::in_root_node_ids::stored_type>(
          ColumnFlag::in_root_node_ids),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::in_root_max_weights::stored_type>(
          ColumnFlag::in_root_max_weights),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::in_is_target_weight_floor::stored_type>(
          ColumnFlag::in_is_target_weight_floor),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,root_node_id_storage_layer_,node_id_storage_layer_,parent_node_id_storage_layer_,in_source_node_ids_storage_layer_,in_dest_node_ids_storage_layer_,in_edge_weights_storage_layer_,in_root_node_ids_storage_layer_,in_root_max_weights_storage_layer_,in_is_target_weight_floor_storage_layer_},
      {{},{},{},parent_node_id_null_layer_,in_source_node_ids_null_layer_,in_dest_node_ids_null_layer_,in_edge_weights_null_layer_,in_root_node_ids_null_layer_,in_root_max_weights_null_layer_,in_is_target_weight_floor_null_layer_});
  }
  ~DfsWeightBoundedTable() override;

  static const char* Name() { return "__intrinsic_dfs_weight_bounded"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "root_node_id", ColumnType::root_node_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "node_id", ColumnType::node_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_node_id", ColumnType::parent_node_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "in_source_node_ids", ColumnType::in_source_node_ids::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "in_dest_node_ids", ColumnType::in_dest_node_ids::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "in_edge_weights", ColumnType::in_edge_weights::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "in_root_node_ids", ColumnType::in_root_node_ids::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "in_root_max_weights", ColumnType::in_root_max_weights::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "in_is_target_weight_floor", ColumnType::in_is_target_weight_floor::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    root_node_id_.ShrinkToFit();
    node_id_.ShrinkToFit();
    parent_node_id_.ShrinkToFit();
    in_source_node_ids_.ShrinkToFit();
    in_dest_node_ids_.ShrinkToFit();
    in_edge_weights_.ShrinkToFit();
    in_root_node_ids_.ShrinkToFit();
    in_root_max_weights_.ShrinkToFit();
    in_is_target_weight_floor_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{row_number};
    mutable_root_node_id()->Append(row.root_node_id);
    mutable_node_id()->Append(row.node_id);
    mutable_parent_node_id()->Append(row.parent_node_id);
    mutable_in_source_node_ids()->Append(row.in_source_node_ids);
    mutable_in_dest_node_ids()->Append(row.in_dest_node_ids);
    mutable_in_edge_weights()->Append(row.in_edge_weights);
    mutable_in_root_node_ids()->Append(row.in_root_node_ids);
    mutable_in_root_max_weights()->Append(row.in_root_max_weights);
    mutable_in_is_target_weight_floor()->Append(row.in_is_target_weight_floor);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<DfsWeightBoundedTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<uint32_t>& root_node_id() const {
    return static_cast<const ColumnType::root_node_id&>(columns()[ColumnIndex::root_node_id]);
  }
  const TypedColumn<uint32_t>& node_id() const {
    return static_cast<const ColumnType::node_id&>(columns()[ColumnIndex::node_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& parent_node_id() const {
    return static_cast<const ColumnType::parent_node_id&>(columns()[ColumnIndex::parent_node_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& in_source_node_ids() const {
    return static_cast<const ColumnType::in_source_node_ids&>(columns()[ColumnIndex::in_source_node_ids]);
  }
  const TypedColumn<std::optional<uint32_t>>& in_dest_node_ids() const {
    return static_cast<const ColumnType::in_dest_node_ids&>(columns()[ColumnIndex::in_dest_node_ids]);
  }
  const TypedColumn<std::optional<uint32_t>>& in_edge_weights() const {
    return static_cast<const ColumnType::in_edge_weights&>(columns()[ColumnIndex::in_edge_weights]);
  }
  const TypedColumn<std::optional<uint32_t>>& in_root_node_ids() const {
    return static_cast<const ColumnType::in_root_node_ids&>(columns()[ColumnIndex::in_root_node_ids]);
  }
  const TypedColumn<std::optional<uint32_t>>& in_root_max_weights() const {
    return static_cast<const ColumnType::in_root_max_weights&>(columns()[ColumnIndex::in_root_max_weights]);
  }
  const TypedColumn<std::optional<uint32_t>>& in_is_target_weight_floor() const {
    return static_cast<const ColumnType::in_is_target_weight_floor&>(columns()[ColumnIndex::in_is_target_weight_floor]);
  }

  TypedColumn<uint32_t>* mutable_root_node_id() {
    return static_cast<ColumnType::root_node_id*>(
        GetColumn(ColumnIndex::root_node_id));
  }
  TypedColumn<uint32_t>* mutable_node_id() {
    return static_cast<ColumnType::node_id*>(
        GetColumn(ColumnIndex::node_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_parent_node_id() {
    return static_cast<ColumnType::parent_node_id*>(
        GetColumn(ColumnIndex::parent_node_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_in_source_node_ids() {
    return static_cast<ColumnType::in_source_node_ids*>(
        GetColumn(ColumnIndex::in_source_node_ids));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_in_dest_node_ids() {
    return static_cast<ColumnType::in_dest_node_ids*>(
        GetColumn(ColumnIndex::in_dest_node_ids));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_in_edge_weights() {
    return static_cast<ColumnType::in_edge_weights*>(
        GetColumn(ColumnIndex::in_edge_weights));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_in_root_node_ids() {
    return static_cast<ColumnType::in_root_node_ids*>(
        GetColumn(ColumnIndex::in_root_node_ids));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_in_root_max_weights() {
    return static_cast<ColumnType::in_root_max_weights*>(
        GetColumn(ColumnIndex::in_root_max_weights));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_in_is_target_weight_floor() {
    return static_cast<ColumnType::in_is_target_weight_floor*>(
        GetColumn(ColumnIndex::in_is_target_weight_floor));
  }

 private:
  
  
  ColumnStorage<ColumnType::root_node_id::stored_type> root_node_id_;
  ColumnStorage<ColumnType::node_id::stored_type> node_id_;
  ColumnStorage<ColumnType::parent_node_id::stored_type> parent_node_id_;
  ColumnStorage<ColumnType::in_source_node_ids::stored_type> in_source_node_ids_;
  ColumnStorage<ColumnType::in_dest_node_ids::stored_type> in_dest_node_ids_;
  ColumnStorage<ColumnType::in_edge_weights::stored_type> in_edge_weights_;
  ColumnStorage<ColumnType::in_root_node_ids::stored_type> in_root_node_ids_;
  ColumnStorage<ColumnType::in_root_max_weights::stored_type> in_root_max_weights_;
  ColumnStorage<ColumnType::in_is_target_weight_floor::stored_type> in_is_target_weight_floor_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> root_node_id_storage_layer_;
  RefPtr<column::StorageLayer> node_id_storage_layer_;
  RefPtr<column::StorageLayer> parent_node_id_storage_layer_;
  RefPtr<column::StorageLayer> in_source_node_ids_storage_layer_;
  RefPtr<column::StorageLayer> in_dest_node_ids_storage_layer_;
  RefPtr<column::StorageLayer> in_edge_weights_storage_layer_;
  RefPtr<column::StorageLayer> in_root_node_ids_storage_layer_;
  RefPtr<column::StorageLayer> in_root_max_weights_storage_layer_;
  RefPtr<column::StorageLayer> in_is_target_weight_floor_storage_layer_;

  RefPtr<column::OverlayLayer> parent_node_id_null_layer_;
  RefPtr<column::OverlayLayer> in_source_node_ids_null_layer_;
  RefPtr<column::OverlayLayer> in_dest_node_ids_null_layer_;
  RefPtr<column::OverlayLayer> in_edge_weights_null_layer_;
  RefPtr<column::OverlayLayer> in_root_node_ids_null_layer_;
  RefPtr<column::OverlayLayer> in_root_max_weights_null_layer_;
  RefPtr<column::OverlayLayer> in_is_target_weight_floor_null_layer_;
};
  

class ExperimentalAnnotatedCallstackTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 6;

  using Id = StackProfileCallsiteTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t depth = 1;
    static constexpr uint32_t parent_id = 2;
    static constexpr uint32_t frame_id = 3;
    static constexpr uint32_t annotation = 4;
    static constexpr uint32_t start_id = 5;
  };
  struct ColumnType {
    using id = IdColumn<ExperimentalAnnotatedCallstackTable::Id>;
    using depth = TypedColumn<uint32_t>;
    using parent_id = TypedColumn<std::optional<ExperimentalAnnotatedCallstackTable::Id>>;
    using frame_id = TypedColumn<StackProfileFrameTable::Id>;
    using annotation = TypedColumn<StringPool::Id>;
    using start_id = TypedColumn<StackProfileCallsiteTable::Id>;
  };
  struct Row : public StackProfileCallsiteTable::Row {
    Row(uint32_t in_depth = {},
        std::optional<ExperimentalAnnotatedCallstackTable::Id> in_parent_id = {},
        StackProfileFrameTable::Id in_frame_id = {},
        StringPool::Id in_annotation = {},
        StackProfileCallsiteTable::Id in_start_id = {},
        std::nullptr_t = nullptr)
        : StackProfileCallsiteTable::Row(in_depth, in_parent_id, in_frame_id),
          annotation(in_annotation),
          start_id(in_start_id) {}
    StringPool::Id annotation;
    StackProfileCallsiteTable::Id start_id;

    bool operator==(const ExperimentalAnnotatedCallstackTable::Row& other) const {
      return ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::frame_id::Equals(frame_id, other.frame_id) &&
       ColumnType::annotation::Equals(annotation, other.annotation) &&
       ColumnType::start_id::Equals(start_id, other.start_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t annotation = ColumnType::annotation::default_flags();
    static constexpr uint32_t start_id = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ExperimentalAnnotatedCallstackTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ExperimentalAnnotatedCallstackTable, RowNumber> {
   public:
    ConstRowReference(const ExperimentalAnnotatedCallstackTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::frame_id::type frame_id() const {
      return table()->frame_id()[row_number_];
    }
    ColumnType::annotation::type annotation() const {
      return table()->annotation()[row_number_];
    }
    ColumnType::start_id::type start_id() const {
      return table()->start_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ExperimentalAnnotatedCallstackTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_frame_id(
        ColumnType::frame_id::non_optional_type v) {
      return mutable_table()->mutable_frame_id()->Set(row_number_, v);
    }
    void set_annotation(
        ColumnType::annotation::non_optional_type v) {
      return mutable_table()->mutable_annotation()->Set(row_number_, v);
    }
    void set_start_id(
        ColumnType::start_id::non_optional_type v) {
      return mutable_table()->mutable_start_id()->Set(row_number_, v);
    }

   private:
    ExperimentalAnnotatedCallstackTable* mutable_table() const {
      return const_cast<ExperimentalAnnotatedCallstackTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ExperimentalAnnotatedCallstackTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::frame_id::type frame_id() const {
      const auto& col = table()->frame_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::annotation::type annotation() const {
      const auto& col = table()->annotation();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_id::type start_id() const {
      const auto& col = table()->start_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ExperimentalAnnotatedCallstackTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ExperimentalAnnotatedCallstackTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ExperimentalAnnotatedCallstackTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ExperimentalAnnotatedCallstackTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ExperimentalAnnotatedCallstackTable;

     explicit Iterator(ExperimentalAnnotatedCallstackTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ExperimentalAnnotatedCallstackTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "annotation", &self->annotation_, ColumnFlag::annotation,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "start_id", &self->start_id_, ColumnFlag::start_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ExperimentalAnnotatedCallstackTable(StringPool* pool, StackProfileCallsiteTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), annotation_(ColumnStorage<ColumnType::annotation::stored_type>::Create<false>()),
        start_id_(ColumnStorage<ColumnType::start_id::stored_type>::Create<false>())
,
        annotation_storage_layer_(
          new column::StringStorage(string_pool(), &annotation_.vector())),
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::annotation::stored_type>(
          ColumnFlag::annotation),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::frame_id],annotation_storage_layer_,start_id_storage_layer_},
      {{},{},const_parent_->null_layers()[ColumnIndex::parent_id],{},{},{}});
  }
  ~ExperimentalAnnotatedCallstackTable() override;

  static const char* Name() { return "experimental_annotated_callstack"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "frame_id", ColumnType::frame_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "annotation", ColumnType::annotation::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_id", ColumnType::start_id::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    annotation_.ShrinkToFit();
    start_id_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_annotation()->Append(row.annotation);
    mutable_start_id()->Append(row.start_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<ExperimentalAnnotatedCallstackTable> ExtendParent(
      const StackProfileCallsiteTable& parent,
      ColumnStorage<ColumnType::annotation::stored_type> annotation
, ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    return std::unique_ptr<ExperimentalAnnotatedCallstackTable>(new ExperimentalAnnotatedCallstackTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(annotation), std::move(start_id)));
  }

  static std::unique_ptr<ExperimentalAnnotatedCallstackTable> SelectAndExtendParent(
      const StackProfileCallsiteTable& parent,
      std::vector<StackProfileCallsiteTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::annotation::stored_type> annotation
, ColumnStorage<ColumnType::start_id::stored_type> start_id) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<ExperimentalAnnotatedCallstackTable>(new ExperimentalAnnotatedCallstackTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(annotation), std::move(start_id)));
  }

  const IdColumn<ExperimentalAnnotatedCallstackTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<std::optional<ExperimentalAnnotatedCallstackTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<StackProfileFrameTable::Id>& frame_id() const {
    return static_cast<const ColumnType::frame_id&>(columns()[ColumnIndex::frame_id]);
  }
  const TypedColumn<StringPool::Id>& annotation() const {
    return static_cast<const ColumnType::annotation&>(columns()[ColumnIndex::annotation]);
  }
  const TypedColumn<StackProfileCallsiteTable::Id>& start_id() const {
    return static_cast<const ColumnType::start_id&>(columns()[ColumnIndex::start_id]);
  }

  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<std::optional<ExperimentalAnnotatedCallstackTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<StackProfileFrameTable::Id>* mutable_frame_id() {
    return static_cast<ColumnType::frame_id*>(
        GetColumn(ColumnIndex::frame_id));
  }
  TypedColumn<StringPool::Id>* mutable_annotation() {
    return static_cast<ColumnType::annotation*>(
        GetColumn(ColumnIndex::annotation));
  }
  TypedColumn<StackProfileCallsiteTable::Id>* mutable_start_id() {
    return static_cast<ColumnType::start_id*>(
        GetColumn(ColumnIndex::start_id));
  }

 private:
  ExperimentalAnnotatedCallstackTable(StringPool* pool,
            const StackProfileCallsiteTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::annotation::stored_type> annotation
, ColumnStorage<ColumnType::start_id::stored_type> start_id)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        annotation_storage_layer_(
          new column::StringStorage(string_pool(), &annotation_.vector())),
        start_id_storage_layer_(
        new column::NumericStorage<ColumnType::start_id::non_optional_stored_type>(
          &start_id_.vector(),
          ColumnTypeHelper<ColumnType::start_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::annotation::stored_type>(
          ColumnFlag::annotation),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_id::stored_type>(
          ColumnFlag::start_id),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(annotation.size() == parent_overlay.size());
    annotation_ = std::move(annotation);
    PERFETTO_DCHECK(start_id.size() == parent_overlay.size());
    start_id_ = std::move(start_id);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::frame_id],annotation_storage_layer_,start_id_storage_layer_}, {{},{},const_parent_->null_layers()[ColumnIndex::parent_id],{},{},{}}, std::move(overlay_layers));
  }
  StackProfileCallsiteTable* parent_ = nullptr;
  const StackProfileCallsiteTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::annotation::stored_type> annotation_;
  ColumnStorage<ColumnType::start_id::stored_type> start_id_;

  RefPtr<column::StorageLayer> annotation_storage_layer_;
  RefPtr<column::StorageLayer> start_id_storage_layer_;

  
};
  

class ExperimentalSliceLayoutTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 17;

  using Id = SliceTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
    static constexpr uint32_t layout_depth = 15;
    static constexpr uint32_t filter_track_ids = 16;
  };
  struct ColumnType {
    using id = IdColumn<ExperimentalSliceLayoutTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using depth = TypedColumn<uint32_t>;
    using stack_id = TypedColumn<int64_t>;
    using parent_stack_id = TypedColumn<int64_t>;
    using parent_id = TypedColumn<std::optional<ExperimentalSliceLayoutTable::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using thread_ts = TypedColumn<std::optional<int64_t>>;
    using thread_dur = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_count = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_delta = TypedColumn<std::optional<int64_t>>;
    using layout_depth = TypedColumn<uint32_t>;
    using filter_track_ids = TypedColumn<StringPool::Id>;
  };
  struct Row : public SliceTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        uint32_t in_depth = {},
        int64_t in_stack_id = {},
        int64_t in_parent_stack_id = {},
        std::optional<ExperimentalSliceLayoutTable::Id> in_parent_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<int64_t> in_thread_ts = {},
        std::optional<int64_t> in_thread_dur = {},
        std::optional<int64_t> in_thread_instruction_count = {},
        std::optional<int64_t> in_thread_instruction_delta = {},
        uint32_t in_layout_depth = {},
        StringPool::Id in_filter_track_ids = {},
        std::nullptr_t = nullptr)
        : SliceTable::Row(in_ts, in_dur, in_track_id, in_category, in_name, in_depth, in_stack_id, in_parent_stack_id, in_parent_id, in_arg_set_id, in_thread_ts, in_thread_dur, in_thread_instruction_count, in_thread_instruction_delta),
          layout_depth(in_layout_depth),
          filter_track_ids(in_filter_track_ids) {}
    uint32_t layout_depth;
    StringPool::Id filter_track_ids;

    bool operator==(const ExperimentalSliceLayoutTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::stack_id::Equals(stack_id, other.stack_id) &&
       ColumnType::parent_stack_id::Equals(parent_stack_id, other.parent_stack_id) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::thread_ts::Equals(thread_ts, other.thread_ts) &&
       ColumnType::thread_dur::Equals(thread_dur, other.thread_dur) &&
       ColumnType::thread_instruction_count::Equals(thread_instruction_count, other.thread_instruction_count) &&
       ColumnType::thread_instruction_delta::Equals(thread_instruction_delta, other.thread_instruction_delta) &&
       ColumnType::layout_depth::Equals(layout_depth, other.layout_depth) &&
       ColumnType::filter_track_ids::Equals(filter_track_ids, other.filter_track_ids);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t layout_depth = ColumnType::layout_depth::default_flags();
    static constexpr uint32_t filter_track_ids = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::filter_track_ids::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ExperimentalSliceLayoutTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ExperimentalSliceLayoutTable, RowNumber> {
   public:
    ConstRowReference(const ExperimentalSliceLayoutTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::stack_id::type stack_id() const {
      return table()->stack_id()[row_number_];
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      return table()->parent_stack_id()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::thread_ts::type thread_ts() const {
      return table()->thread_ts()[row_number_];
    }
    ColumnType::thread_dur::type thread_dur() const {
      return table()->thread_dur()[row_number_];
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      return table()->thread_instruction_count()[row_number_];
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      return table()->thread_instruction_delta()[row_number_];
    }
    ColumnType::layout_depth::type layout_depth() const {
      return table()->layout_depth()[row_number_];
    }
    ColumnType::filter_track_ids::type filter_track_ids() const {
      return table()->filter_track_ids()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ExperimentalSliceLayoutTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_stack_id(
        ColumnType::stack_id::non_optional_type v) {
      return mutable_table()->mutable_stack_id()->Set(row_number_, v);
    }
    void set_parent_stack_id(
        ColumnType::parent_stack_id::non_optional_type v) {
      return mutable_table()->mutable_parent_stack_id()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_thread_ts(
        ColumnType::thread_ts::non_optional_type v) {
      return mutable_table()->mutable_thread_ts()->Set(row_number_, v);
    }
    void set_thread_dur(
        ColumnType::thread_dur::non_optional_type v) {
      return mutable_table()->mutable_thread_dur()->Set(row_number_, v);
    }
    void set_thread_instruction_count(
        ColumnType::thread_instruction_count::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_count()->Set(row_number_, v);
    }
    void set_thread_instruction_delta(
        ColumnType::thread_instruction_delta::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_delta()->Set(row_number_, v);
    }
    void set_layout_depth(
        ColumnType::layout_depth::non_optional_type v) {
      return mutable_table()->mutable_layout_depth()->Set(row_number_, v);
    }
    void set_filter_track_ids(
        ColumnType::filter_track_ids::non_optional_type v) {
      return mutable_table()->mutable_filter_track_ids()->Set(row_number_, v);
    }

   private:
    ExperimentalSliceLayoutTable* mutable_table() const {
      return const_cast<ExperimentalSliceLayoutTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ExperimentalSliceLayoutTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stack_id::type stack_id() const {
      const auto& col = table()->stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      const auto& col = table()->parent_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_ts::type thread_ts() const {
      const auto& col = table()->thread_ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_dur::type thread_dur() const {
      const auto& col = table()->thread_dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      const auto& col = table()->thread_instruction_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      const auto& col = table()->thread_instruction_delta();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::layout_depth::type layout_depth() const {
      const auto& col = table()->layout_depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::filter_track_ids::type filter_track_ids() const {
      const auto& col = table()->filter_track_ids();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ExperimentalSliceLayoutTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ExperimentalSliceLayoutTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ExperimentalSliceLayoutTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ExperimentalSliceLayoutTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ExperimentalSliceLayoutTable;

     explicit Iterator(ExperimentalSliceLayoutTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ExperimentalSliceLayoutTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "layout_depth", &self->layout_depth_, ColumnFlag::layout_depth,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "filter_track_ids", &self->filter_track_ids_, ColumnFlag::filter_track_ids,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ExperimentalSliceLayoutTable(StringPool* pool, SliceTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), layout_depth_(ColumnStorage<ColumnType::layout_depth::stored_type>::Create<false>()),
        filter_track_ids_(ColumnStorage<ColumnType::filter_track_ids::stored_type>::Create<false>())
,
        layout_depth_storage_layer_(
        new column::NumericStorage<ColumnType::layout_depth::non_optional_stored_type>(
          &layout_depth_.vector(),
          ColumnTypeHelper<ColumnType::layout_depth::stored_type>::ToColumnType(),
          false)),
        filter_track_ids_storage_layer_(
          new column::StringStorage(string_pool(), &filter_track_ids_.vector()))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::layout_depth::stored_type>(
          ColumnFlag::layout_depth),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::filter_track_ids::stored_type>(
          ColumnFlag::filter_track_ids),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],layout_depth_storage_layer_,filter_track_ids_storage_layer_},
      {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{},{}});
  }
  ~ExperimentalSliceLayoutTable() override;

  static const char* Name() { return "experimental_slice_layout"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stack_id", ColumnType::stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_stack_id", ColumnType::parent_stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_ts", ColumnType::thread_ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_dur", ColumnType::thread_dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_count", ColumnType::thread_instruction_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_delta", ColumnType::thread_instruction_delta::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "layout_depth", ColumnType::layout_depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "filter_track_ids", ColumnType::filter_track_ids::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    layout_depth_.ShrinkToFit();
    filter_track_ids_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_layout_depth()->Append(row.layout_depth);
    mutable_filter_track_ids()->Append(row.filter_track_ids);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<ExperimentalSliceLayoutTable> ExtendParent(
      const SliceTable& parent,
      ColumnStorage<ColumnType::layout_depth::stored_type> layout_depth
, ColumnStorage<ColumnType::filter_track_ids::stored_type> filter_track_ids) {
    return std::unique_ptr<ExperimentalSliceLayoutTable>(new ExperimentalSliceLayoutTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(layout_depth), std::move(filter_track_ids)));
  }

  static std::unique_ptr<ExperimentalSliceLayoutTable> SelectAndExtendParent(
      const SliceTable& parent,
      std::vector<SliceTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::layout_depth::stored_type> layout_depth
, ColumnStorage<ColumnType::filter_track_ids::stored_type> filter_track_ids) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<ExperimentalSliceLayoutTable>(new ExperimentalSliceLayoutTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(layout_depth), std::move(filter_track_ids)));
  }

  const IdColumn<ExperimentalSliceLayoutTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<int64_t>& stack_id() const {
    return static_cast<const ColumnType::stack_id&>(columns()[ColumnIndex::stack_id]);
  }
  const TypedColumn<int64_t>& parent_stack_id() const {
    return static_cast<const ColumnType::parent_stack_id&>(columns()[ColumnIndex::parent_stack_id]);
  }
  const TypedColumn<std::optional<ExperimentalSliceLayoutTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_ts() const {
    return static_cast<const ColumnType::thread_ts&>(columns()[ColumnIndex::thread_ts]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_dur() const {
    return static_cast<const ColumnType::thread_dur&>(columns()[ColumnIndex::thread_dur]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_count() const {
    return static_cast<const ColumnType::thread_instruction_count&>(columns()[ColumnIndex::thread_instruction_count]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_delta() const {
    return static_cast<const ColumnType::thread_instruction_delta&>(columns()[ColumnIndex::thread_instruction_delta]);
  }
  const TypedColumn<uint32_t>& layout_depth() const {
    return static_cast<const ColumnType::layout_depth&>(columns()[ColumnIndex::layout_depth]);
  }
  const TypedColumn<StringPool::Id>& filter_track_ids() const {
    return static_cast<const ColumnType::filter_track_ids&>(columns()[ColumnIndex::filter_track_ids]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<int64_t>* mutable_stack_id() {
    return static_cast<ColumnType::stack_id*>(
        GetColumn(ColumnIndex::stack_id));
  }
  TypedColumn<int64_t>* mutable_parent_stack_id() {
    return static_cast<ColumnType::parent_stack_id*>(
        GetColumn(ColumnIndex::parent_stack_id));
  }
  TypedColumn<std::optional<ExperimentalSliceLayoutTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_ts() {
    return static_cast<ColumnType::thread_ts*>(
        GetColumn(ColumnIndex::thread_ts));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_dur() {
    return static_cast<ColumnType::thread_dur*>(
        GetColumn(ColumnIndex::thread_dur));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_count() {
    return static_cast<ColumnType::thread_instruction_count*>(
        GetColumn(ColumnIndex::thread_instruction_count));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_delta() {
    return static_cast<ColumnType::thread_instruction_delta*>(
        GetColumn(ColumnIndex::thread_instruction_delta));
  }
  TypedColumn<uint32_t>* mutable_layout_depth() {
    return static_cast<ColumnType::layout_depth*>(
        GetColumn(ColumnIndex::layout_depth));
  }
  TypedColumn<StringPool::Id>* mutable_filter_track_ids() {
    return static_cast<ColumnType::filter_track_ids*>(
        GetColumn(ColumnIndex::filter_track_ids));
  }

 private:
  ExperimentalSliceLayoutTable(StringPool* pool,
            const SliceTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::layout_depth::stored_type> layout_depth
, ColumnStorage<ColumnType::filter_track_ids::stored_type> filter_track_ids)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        layout_depth_storage_layer_(
        new column::NumericStorage<ColumnType::layout_depth::non_optional_stored_type>(
          &layout_depth_.vector(),
          ColumnTypeHelper<ColumnType::layout_depth::stored_type>::ToColumnType(),
          false)),
        filter_track_ids_storage_layer_(
          new column::StringStorage(string_pool(), &filter_track_ids_.vector()))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::layout_depth::stored_type>(
          ColumnFlag::layout_depth),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::filter_track_ids::stored_type>(
          ColumnFlag::filter_track_ids),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(layout_depth.size() == parent_overlay.size());
    layout_depth_ = std::move(layout_depth);
    PERFETTO_DCHECK(filter_track_ids.size() == parent_overlay.size());
    filter_track_ids_ = std::move(filter_track_ids);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],layout_depth_storage_layer_,filter_track_ids_storage_layer_}, {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{},{}}, std::move(overlay_layers));
  }
  SliceTable* parent_ = nullptr;
  const SliceTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::layout_depth::stored_type> layout_depth_;
  ColumnStorage<ColumnType::filter_track_ids::stored_type> filter_track_ids_;

  RefPtr<column::StorageLayer> layout_depth_storage_layer_;
  RefPtr<column::StorageLayer> filter_track_ids_storage_layer_;

  
};
  

class PerfettoTableInfoTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 6;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t table_name = 1;
    static constexpr uint32_t name = 2;
    static constexpr uint32_t col_type = 3;
    static constexpr uint32_t nullable = 4;
    static constexpr uint32_t sorted = 5;
  };
  struct ColumnType {
    using id = IdColumn<PerfettoTableInfoTable::Id>;
    using table_name = TypedColumn<StringPool::Id>;
    using name = TypedColumn<StringPool::Id>;
    using col_type = TypedColumn<StringPool::Id>;
    using nullable = TypedColumn<int64_t>;
    using sorted = TypedColumn<int64_t>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(StringPool::Id in_table_name = {},
        StringPool::Id in_name = {},
        StringPool::Id in_col_type = {},
        int64_t in_nullable = {},
        int64_t in_sorted = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          table_name(in_table_name),
          name(in_name),
          col_type(in_col_type),
          nullable(in_nullable),
          sorted(in_sorted) {}
    StringPool::Id table_name;
    StringPool::Id name;
    StringPool::Id col_type;
    int64_t nullable;
    int64_t sorted;

    bool operator==(const PerfettoTableInfoTable::Row& other) const {
      return ColumnType::table_name::Equals(table_name, other.table_name) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::col_type::Equals(col_type, other.col_type) &&
       ColumnType::nullable::Equals(nullable, other.nullable) &&
       ColumnType::sorted::Equals(sorted, other.sorted);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t table_name = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::table_name::default_flags();
    static constexpr uint32_t name = ColumnType::name::default_flags();
    static constexpr uint32_t col_type = ColumnType::col_type::default_flags();
    static constexpr uint32_t nullable = ColumnType::nullable::default_flags();
    static constexpr uint32_t sorted = ColumnType::sorted::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      PerfettoTableInfoTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    PerfettoTableInfoTable, RowNumber> {
   public:
    ConstRowReference(const PerfettoTableInfoTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::table_name::type table_name() const {
      return table()->table_name()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::col_type::type col_type() const {
      return table()->col_type()[row_number_];
    }
    ColumnType::nullable::type nullable() const {
      return table()->nullable()[row_number_];
    }
    ColumnType::sorted::type sorted() const {
      return table()->sorted()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const PerfettoTableInfoTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_table_name(
        ColumnType::table_name::non_optional_type v) {
      return mutable_table()->mutable_table_name()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_col_type(
        ColumnType::col_type::non_optional_type v) {
      return mutable_table()->mutable_col_type()->Set(row_number_, v);
    }
    void set_nullable(
        ColumnType::nullable::non_optional_type v) {
      return mutable_table()->mutable_nullable()->Set(row_number_, v);
    }
    void set_sorted(
        ColumnType::sorted::non_optional_type v) {
      return mutable_table()->mutable_sorted()->Set(row_number_, v);
    }

   private:
    PerfettoTableInfoTable* mutable_table() const {
      return const_cast<PerfettoTableInfoTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, PerfettoTableInfoTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::table_name::type table_name() const {
      const auto& col = table()->table_name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::col_type::type col_type() const {
      const auto& col = table()->col_type();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::nullable::type nullable() const {
      const auto& col = table()->nullable();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::sorted::type sorted() const {
      const auto& col = table()->sorted();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const PerfettoTableInfoTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class PerfettoTableInfoTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, PerfettoTableInfoTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<PerfettoTableInfoTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class PerfettoTableInfoTable;

     explicit Iterator(PerfettoTableInfoTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      PerfettoTableInfoTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "table_name", &self->table_name_, ColumnFlag::table_name,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "name", &self->name_, ColumnFlag::name,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "col_type", &self->col_type_, ColumnFlag::col_type,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "nullable", &self->nullable_, ColumnFlag::nullable,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "sorted", &self->sorted_, ColumnFlag::sorted,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit PerfettoTableInfoTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        table_name_(ColumnStorage<ColumnType::table_name::stored_type>::Create<false>()),
        name_(ColumnStorage<ColumnType::name::stored_type>::Create<false>()),
        col_type_(ColumnStorage<ColumnType::col_type::stored_type>::Create<false>()),
        nullable_(ColumnStorage<ColumnType::nullable::stored_type>::Create<false>()),
        sorted_(ColumnStorage<ColumnType::sorted::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        table_name_storage_layer_(
          new column::StringStorage(string_pool(), &table_name_.vector())),
        name_storage_layer_(
          new column::StringStorage(string_pool(), &name_.vector())),
        col_type_storage_layer_(
          new column::StringStorage(string_pool(), &col_type_.vector())),
        nullable_storage_layer_(
        new column::NumericStorage<ColumnType::nullable::non_optional_stored_type>(
          &nullable_.vector(),
          ColumnTypeHelper<ColumnType::nullable::stored_type>::ToColumnType(),
          false)),
        sorted_storage_layer_(
        new column::NumericStorage<ColumnType::sorted::non_optional_stored_type>(
          &sorted_.vector(),
          ColumnTypeHelper<ColumnType::sorted::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::table_name::stored_type>(
          ColumnFlag::table_name),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::name::stored_type>(
          ColumnFlag::name),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::col_type::stored_type>(
          ColumnFlag::col_type),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::nullable::stored_type>(
          ColumnFlag::nullable),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::sorted::stored_type>(
          ColumnFlag::sorted),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,table_name_storage_layer_,name_storage_layer_,col_type_storage_layer_,nullable_storage_layer_,sorted_storage_layer_},
      {{},{},{},{},{},{}});
  }
  ~PerfettoTableInfoTable() override;

  static const char* Name() { return "perfetto_table_info"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "table_name", ColumnType::table_name::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "col_type", ColumnType::col_type::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "nullable", ColumnType::nullable::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "sorted", ColumnType::sorted::SqlValueType(), false,
        false,
        false,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    table_name_.ShrinkToFit();
    name_.ShrinkToFit();
    col_type_.ShrinkToFit();
    nullable_.ShrinkToFit();
    sorted_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{row_number};
    mutable_table_name()->Append(row.table_name);
    mutable_name()->Append(row.name);
    mutable_col_type()->Append(row.col_type);
    mutable_nullable()->Append(row.nullable);
    mutable_sorted()->Append(row.sorted);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<PerfettoTableInfoTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<StringPool::Id>& table_name() const {
    return static_cast<const ColumnType::table_name&>(columns()[ColumnIndex::table_name]);
  }
  const TypedColumn<StringPool::Id>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<StringPool::Id>& col_type() const {
    return static_cast<const ColumnType::col_type&>(columns()[ColumnIndex::col_type]);
  }
  const TypedColumn<int64_t>& nullable() const {
    return static_cast<const ColumnType::nullable&>(columns()[ColumnIndex::nullable]);
  }
  const TypedColumn<int64_t>& sorted() const {
    return static_cast<const ColumnType::sorted&>(columns()[ColumnIndex::sorted]);
  }

  TypedColumn<StringPool::Id>* mutable_table_name() {
    return static_cast<ColumnType::table_name*>(
        GetColumn(ColumnIndex::table_name));
  }
  TypedColumn<StringPool::Id>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<StringPool::Id>* mutable_col_type() {
    return static_cast<ColumnType::col_type*>(
        GetColumn(ColumnIndex::col_type));
  }
  TypedColumn<int64_t>* mutable_nullable() {
    return static_cast<ColumnType::nullable*>(
        GetColumn(ColumnIndex::nullable));
  }
  TypedColumn<int64_t>* mutable_sorted() {
    return static_cast<ColumnType::sorted*>(
        GetColumn(ColumnIndex::sorted));
  }

 private:
  
  
  ColumnStorage<ColumnType::table_name::stored_type> table_name_;
  ColumnStorage<ColumnType::name::stored_type> name_;
  ColumnStorage<ColumnType::col_type::stored_type> col_type_;
  ColumnStorage<ColumnType::nullable::stored_type> nullable_;
  ColumnStorage<ColumnType::sorted::stored_type> sorted_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> table_name_storage_layer_;
  RefPtr<column::StorageLayer> name_storage_layer_;
  RefPtr<column::StorageLayer> col_type_storage_layer_;
  RefPtr<column::StorageLayer> nullable_storage_layer_;
  RefPtr<column::StorageLayer> sorted_storage_layer_;

  
};

}  // namespace perfetto

#endif  // SRC_TRACE_PROCESSOR_PERFETTO_SQL_INTRINSICS_TABLE_FUNCTIONS_TABLES_PY_H_
